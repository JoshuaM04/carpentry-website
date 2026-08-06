import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stripe from 'stripe';
import multer from 'multer';
import crypto from 'crypto';
import { put } from '@vercel/blob'
import { getProduct, ALLOWED_FINISHES, MAX_QUANTITY_PER_ITEM } from './catalog.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

app.post('/api/checkout', async (request, response) => {
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
