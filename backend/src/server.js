import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stripe from 'stripe';
import multer from 'multer';
import crypto from 'crypto';
import { put } from '@vercel/blob'
import { getProduct, getCatalog, ALLOWED_FINISHES, MAX_QUANTITY_PER_ITEM } from './catalog.js';
import { checkChatRateLimit } from './chatRateLimiter.js';

dotenv.config({ path: new URL('../../.env', import.meta.url) });

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

const app = express();
// Automatically intercepts incoming JSON strings and parses them automatically.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Origins carry no trailing slash — a browser's Origin header never has one,
// so an entry written with a slash can never match.
app.use(cors({
    origin: [
        'https://woodwork-creations.com',
        'http://localhost:5173'
    ],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

/* Uploads are public, unauthenticated, and billed by the gigabyte, so they are
   capped well below what the storage tier would allow. */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 25 * 1024 * 1024;

/* Review submissions per IP per window. Reviews are rare and hand-written;
   anything above this is a script. */
const REVIEW_WINDOW_MS = 60 * 60 * 1000;
const MAX_REVIEWS_PER_WINDOW = 3;
const MAX_CHAT_MESSAGES = 20;
const MAX_CHAT_MESSAGE_LENGTH = 2000;
const CHAT_SYSTEM_PROMPT = `You are the helpful AI assistant for WoodWork Creations, a family-owned carpentry business.
Only answer questions about WoodWork Creations, its business, furniture catalog, product options, ordering, pickup, delivery, care, or custom commissions.
WoodWork Creations is family-owned and based in San Marcos, Texas. Do not invent the names of the owners or other business details not provided here.
We do not offer shipping at this time. We currently offer local pickup only. We hope to offer shipping in the future.
Use the catalog facts supplied below as the source of truth for product names, prices, approximate completion times, materials, dimensions, and finishes.
Treat products listed in the catalog as available to inquire about, but do not claim real-time stock or guaranteed availability.
Never calculate or guess prices, delivery dates, policies, or inventory beyond those facts.
If the catalog does not answer a product question, say that you do not have that information and suggest contacting the business directly.
Do not answer general knowledge, math, coding, political, medical, legal, or unrelated questions.
Be concise, warm, and honest.

CATALOG:
{{CATALOG}}`;

const CHAT_OFF_TOPIC_RESPONSE = "I can help with WoodWork Creations furniture, product options, ordering, pickup, delivery, care, and custom commissions. What would you like to know?";
const CHAT_SHIPPING_RESPONSE = "We do not offer shipping at this time. We currently offer local pickup only, and we hope to offer shipping in the future.";
const CHAT_GREETING_RESPONSE = "Hi! I'm doing well, thanks for asking. I can tell you about WoodWork Creations' furniture, finishes, pricing, pickup, or custom commissions. What would you like to explore?";
const CHAT_BUSINESS_RESPONSE = "WoodWork Creations is a family-owned carpentry business based in San Marcos, Texas. I can also tell you about our furniture, finishes, pricing, pickup, or custom commissions.";
const CHAT_TOPIC_TERMS = [
    'woodwork', 'furniture', 'catalog', 'product', 'piece', 'table', 'nightstand',
    'earth wood', 'hazy night', 'wood', 'finish', 'stain', 'espresso', 'olive',
    'gray', 'price', 'cost', 'cheapest', 'expensive', 'lowest', 'highest',
    'affordable', 'buy', 'order', 'cart', 'checkout', 'available',
    'availability', 'pickup', 'delivery', 'shipping', 'commission', 'custom',
    'care', 'material', 'poplar', 'pine', 'dimension', 'size', 'width', 'height',
    'diameter', 'contact'
];

const CHAT_INVENTORY_PATTERNS = [
    /\bdo you (sell|carry|offer)\b/i,
    /\bdo you have\b/i,
    /\bhow many\b.{0,40}\b(do you have|are available|are there)\b/i,
    /\b(in stock|inventory|items? available)\b/i
];

const CHAT_BUSINESS_PATTERNS = [
    /\bwho('?s| is) the (business )?owners?\b/i,
    /\bwho are the (business )?owners?\b/i,
    /\bwho (runs|owns) (this |the )?(business|company|shop|store)\b/i,
    /\bwhere is (this |the |your )?(business|company|shop|store) located\b/i,
    /\bwhat('?s| is) the (business|company|shop|store)'?s location\b/i,
    /\b(business|company|shop|store) address\b/i,
    /\bwhere (are|is) you (located|based)\b/i
];

const CHAT_GREETING_PATTERNS = [
    /^(hi|hello|hey)\b(?:[!,. ]|$)/i,
    /^(hi|hello|hey)\b.{0,40}\bhow are you\b/i
];

const CHAT_PROMPT_INJECTION_PATTERNS = [
    /\bignore\b.{0,40}\b(previous|prior|earlier|above|all)\b.{0,40}\binstructions?\b/i,
    /\bdisregard\b.{0,40}\b(previous|prior|earlier|above|all)\b.{0,40}\binstructions?\b/i,
    /\bforget\b.{0,40}\b(previous|prior|earlier|above|all)\b.{0,40}\binstructions?\b/i,
    /\b(system prompt|developer message|hidden instructions?)\b/i,
    /\b(jailbreak|do anything now|dan mode)\b/i,
    /\b(?:you are|act as|pretend to be)\b.{0,40}\b(?:instead|unrestricted|different|another)\b/i
];

const isPromptInjection = (text) => CHAT_PROMPT_INJECTION_PATTERNS
    .some((pattern) => pattern.test(text));

const isOnTopic = (messageContent) => {
    const text = messageContent.toLowerCase();

    return CHAT_TOPIC_TERMS.some((term) => text.includes(term))
        || CHAT_INVENTORY_PATTERNS.some((pattern) => pattern.test(text))
        || CHAT_BUSINESS_PATTERNS.some((pattern) => pattern.test(text))
        || CHAT_GREETING_PATTERNS.some((pattern) => pattern.test(text));
};

const getCatalogPrompt = () => getCatalog()
    .map((product) => [
        `- ${product.name} (${product.type}): $${product.price.toFixed(2)}; approximate completion time: ${product.completionTime}`,
        `  Material: ${product.wood}; dimensions: ${product.dimensions};`,
        `  finishes: ${product.finishes.join(', ')}.`
    ].join('\n'))
    .join('\n');

const FIELD_LIMITS = {
    title: 120,
    comment: 2000,
    username: 60,
    email: 254
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_VIDEO_BYTES }
});

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: FIELD_LIMITS.title },
    // Bounded at the schema so a stored rating can never break the renderer,
    // which sizes its star row off (5 - rating).
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: FIELD_LIMITS.comment },
    username: { type: String, required: true, trim: true, maxlength: FIELD_LIMITS.username },
    imageUpload: { type: String, default: '' },
    videoUpload: { type: String, default: '' },
    // Never served: see the projection on GET /api/reviews/:productKey.
    email: { type: String, required: true, trim: true, maxlength: FIELD_LIMITS.email },
    productIdentifier: { type: String, required: true },
    // Salted hash, not an address — enough to rate limit, not enough to identify.
    ipHash: { type: String, default: '', index: true },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'reviews' });

const ReviewCollection = mongoose.models.Review || mongoose.model('Review', reviewSchema);

/* Fields withheld from every public read of a review. */
const PUBLIC_REVIEW_PROJECTION = '-email -ipHash';

const hashClientIp = (request) => {
    const forwarded = request.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : '').trim()
        || request.socket?.remoteAddress
        || '';

    if (!ip) return '';

    return crypto
        .createHash('sha256')
        .update(`${process.env.IP_HASH_SALT || ''}:${ip}`)
        .digest('hex');
};

const connectDB = async (request, response, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
        return next();
    } catch (error) {
        console.error("Database connection failed:", error);
        return response.status(500).json({ success: false, error: "Database connection failed", mongoError: error.message });
    }
}

/* multer throws rather than calling next(err) with a usable status, so the
   upload middleware is wrapped to turn a size overrun into a 413. */
const handleUploads = (request, response, next) => {
    const runUpload = upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]);

    runUpload(request, response, (error) => {
        if (!error) return next();

        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return response.status(413).json({ success: false, error: "That file is too large." });
        }

        return response.status(400).json({ success: false, error: "Upload failed." });
    });
};

/* Everything checkable without touching the database, so a malformed or
   oversized submission is rejected before a connection is opened. Runs after
   handleUploads because the body is multipart and multer parses it. */
const validateReview = (request, response, next) => {
    const { title, rating, comment, username, email } = request.body;

    if (!getProduct(request.params.productKey)) {
        return response.status(404).json({ success: false, error: "Unknown product." });
    }

    const parsedRating = Number(rating);

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return response.status(400).json({ success: false, error: "Rating must be a whole number from 1 to 5." });
    }

    for (const [field, value] of Object.entries({ title, comment, username, email })) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            return response.status(400).json({ success: false, error: `${field} is required.` });
        }

        if (value.length > FIELD_LIMITS[field]) {
            return response.status(400).json({ success: false, error: `${field} is too long.` });
        }
    }

    const imageFile = request.files && request.files['image'] ? request.files['image'][0] : null;
    const videoFile = request.files && request.files['video'] ? request.files['video'][0] : null;

    if (imageFile && imageFile.size > MAX_IMAGE_BYTES) {
        return response.status(413).json({ success: false, error: "That image is too large." });
    }

    if (imageFile && !imageFile.mimetype.startsWith('image/')) {
        return response.status(400).json({ success: false, error: "That file is not an image." });
    }

    if (videoFile && !videoFile.mimetype.startsWith('video/')) {
        return response.status(400).json({ success: false, error: "That file is not a video." });
    }

    request.parsedRating = parsedRating;
    request.imageFile = imageFile;
    request.videoFile = videoFile;

    return next();
};

app.post('/api/reviews/:productKey', handleUploads, validateReview, connectDB, async(request, response) => {
    try {
        const { productKey } = request.params;
        const { title, comment, username, email } = request.body;
        const { parsedRating, imageFile, videoFile } = request;

        /* Rate limit off the reviews themselves — a warm-container counter would
           reset on every cold start and is not shared between instances. */
        const ipHash = hashClientIp(request);

        if (ipHash) {
            const recentCount = await ReviewCollection.countDocuments({
                ipHash,
                timestamp: { $gte: new Date(Date.now() - REVIEW_WINDOW_MS) }
            });

            if (recentCount >= MAX_REVIEWS_PER_WINDOW) {
                return response.status(429).json({ success: false, error: "Too many reviews submitted. Please try again later." });
            }
        }

        let resolvedImageUrl = '';
        let resolvedVideoUrl = '';

        if (imageFile) {
            const blob = await put(`reviews/${Date.now()}=${imageFile.originalname}`, imageFile.buffer, {
                access: 'public',
                contentType: imageFile.mimetype
            });

            resolvedImageUrl = blob.url;
        }

        if (videoFile) {
            const blob = await put(`reviews/${Date.now()}=${videoFile.originalname}`, videoFile.buffer, {
                access: 'public',
                contentType: videoFile.mimetype
            });

            resolvedVideoUrl = blob.url;
        }

        const newReview = await ReviewCollection.create({
            productIdentifier: productKey,
            title,
            rating: parsedRating,
            comment,
            username,
            imageUpload: resolvedImageUrl,
            videoUpload: resolvedVideoUrl,
            email,
            ipHash
        });

        // Re-read through the public projection so the response cannot leak
        // the fields the GET route withholds.
        const publicReview = await ReviewCollection
            .findById(newReview._id)
            .select(PUBLIC_REVIEW_PROJECTION);

        response.status(201).json(publicReview);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return response.status(400).json({ success: false, error: "That review is not valid." });
        }

        console.error("Review submission error:", error);
        response.status(500).json({ success: false, error: "Could not save that review." });
    }
});

app.get('/api/reviews/:productKey', connectDB, async (request, response) => {
    try {
        const { productKey } = request.params;

        const reviews = await ReviewCollection
            .find({ productIdentifier: productKey })
            .select(PUBLIC_REVIEW_PROJECTION);

        response.status(200).json(reviews);
    } catch (error) {
        console.error("Review fetch error:", error);
        response.status(500).json({ success: false, error: "Could not load reviews." });
    }
});

app.post('/api/chat', async (request, response) => {
    const { messages } = request.body || {};

    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_CHAT_MESSAGES) {
        return response.status(400).json({ error: "Chat messages are required." });
    }

    const validMessages = messages.every((message) => (
        message
        && (message.role === 'user' || message.role === 'assistant')
        && typeof message.content === 'string'
        && message.content.trim().length > 0
        && message.content.length <= MAX_CHAT_MESSAGE_LENGTH
    ));

    if (!validMessages || messages[messages.length - 1].role !== 'user') {
        return response.status(400).json({ error: "That chat message is not valid." });
    }

    const latestMessage = messages[messages.length - 1].content.trim();

    // Keep instruction overrides and unrelated requests out of the model path.
    // This is intentionally deterministic so a model cannot be prompted to
    // ignore the application's topic restrictions.
    if (isPromptInjection(latestMessage) || !isOnTopic(latestMessage)) {
        return response.status(200).json({
            message: { role: 'assistant', content: CHAT_OFF_TOPIC_RESPONSE }
        });
    }

    const normalizedLatestMessage = latestMessage.toLowerCase();

    if (CHAT_GREETING_PATTERNS.some((pattern) => pattern.test(latestMessage))) {
        return response.status(200).json({
            message: { role: 'assistant', content: CHAT_GREETING_RESPONSE }
        });
    }

    if (CHAT_BUSINESS_PATTERNS.some((pattern) => pattern.test(latestMessage))) {
        return response.status(200).json({
            message: { role: 'assistant', content: CHAT_BUSINESS_RESPONSE }
        });
    }

    if (/\bshipping\b|\bship\b/.test(normalizedLatestMessage)) {
        return response.status(200).json({
            message: { role: 'assistant', content: CHAT_SHIPPING_RESPONSE }
        });
    }

    if (!process.env.HF_TOKEN) {
        console.error("Chat request rejected: HF_TOKEN is not configured.");
        return response.status(503).json({ error: "The AI assistant is not configured." });
    }

    const rateLimit = await checkChatRateLimit({
        identity: hashClientIp(request),
        messages
    });

    if (rateLimit.status === 'limited') {
        response.set('Retry-After', String(rateLimit.retryAfterSeconds));
        return response.status(429).json({
            error: "You've reached the chat usage limit. Please try again later."
        });
    }

    if (rateLimit.status === 'unavailable') {
        console.error("Chat request rejected:", rateLimit.error);
        return response.status(503).json({ error: "Chat protection is temporarily unavailable." });
    }

    try {
        const providerResponse = await fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.HF_TOKEN}`
            },
            body: JSON.stringify({
                model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
                messages: [
                    { role: 'system', content: CHAT_SYSTEM_PROMPT.replace('{{CATALOG}}', getCatalogPrompt()) },
                    ...messages.map((message) => ({
                        role: message.role,
                        content: message.content.trim()
                    }))
                ],
                max_tokens: 300,
                temperature: 0.2
            })
        });

        if (!providerResponse.ok) {
            const providerError = await providerResponse.text();
            console.error("Chat provider error:", providerResponse.status, providerError);
            return response.status(502).json({ error: "The AI assistant could not respond." });
        }

        const completion = await providerResponse.json();
        const content = completion.choices?.[0]?.message?.content;

        if (typeof content !== 'string' || content.trim().length === 0) {
            console.error("Chat provider returned no assistant message.");
            return response.status(502).json({ error: "The AI assistant returned an invalid response." });
        }

        return response.status(200).json({
            message: { role: 'assistant', content: content.trim() }
        });
    } catch (error) {
        console.error("Chat request error:", error);
        return response.status(502).json({ error: "The AI assistant could not respond." });
    }
});

app.post('/api/checkout', async (request, response) => {
    if (!stripe) {
        console.error("Checkout request rejected: STRIPE_SECRET_KEY is not configured.");
        return response.status(503).json({ error: "Checkout is not configured." });
    }

    try {
        const { cartItems } = request.body;

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return response.status(400).json({ error: "Your cart is empty." });
        }

        const lineItems = [];

        for (const item of cartItems) {
            /* Price, name, and image come from the server catalog. Nothing the
               client sends about money is trusted — only which product, which
               finish, and how many. */
            const product = item && getProduct(item.id);

            if (!product) {
                return response.status(400).json({ error: "That item is no longer available." });
            }

            const quantity = Number(item.quantity);

            if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
                return response.status(400).json({ error: "Invalid quantity." });
            }

            const finish = typeof item.activeColor === 'string' ? item.activeColor.toLowerCase() : '';

            if (finish && !ALLOWED_FINISHES.includes(finish)) {
                return response.status(400).json({ error: "Unknown finish." });
            }

            const formattedFinish = finish
                ? `(${finish.charAt(0).toUpperCase() + finish.slice(1)})`
                : '';

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${product.name} ${formattedFinish}`.trim(),
                        images: [product.imageUrl],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],

            shipping_address_collection: {
                allowed_countries: ['US'],
            },

            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'usd'
                        },
                        display_name: 'Local Pickup'
                    }
                }
            ],

            line_items: lineItems,
            mode: 'payment',
            success_url: 'https://woodwork-creations.com/',
            cancel_url: 'https://woodwork-creations.com/'
        });

        return response.status(200).json({ url: session.url });
    } catch (error) {
        console.error("Stripe session error:", error);
        return response.status(500).json({ error: "Could not start checkout." });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(8080, () => console.log("Server running on port 8080"));
}

export default app;
