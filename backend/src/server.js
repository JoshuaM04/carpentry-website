import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Stripe from 'stripe';
import multer from 'multer';
import { put } from '@vercel/blob'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
// Automatically intercepts incoming JSON strings and parses them automatically.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'https://woodwork-creations.com/',
        'http://localhost:5173/'
    ],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }
});

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    username: { type: String, required: true },
    imageUpload: { type: String, default: '' },
    videoUpload: { type: String, default: '' },
    email: { type: String, required: true },
    productIdentifier: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { collection: 'reviews' });

const ReviewCollection = mongoose.models.Review || mongoose.model('Review', reviewSchema);

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

app.post('/api/reviews/:productKey', connectDB, upload.fields([
        { name: 'image', maxCount: 1},
        { name: 'video', maxCount: 1 }
    ]), async(request, response) => {

    try {
        const { productKey } = request.params;
        const { title, rating, comment, username, email } = request.body;

        const imageFile = request.files && request.files['image'] ? request.files['image'][0] : null;
        const videoFile = request.files && request.files['video'] ? request.files['video'][0] : null;

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
            rating,
            comment,
            username,
            imageUpload: resolvedImageUrl,
            videoUpload: resolvedVideoUrl,
            email
        });

        response.status(201).json(newReview);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/reviews/:productKey', connectDB, async (request, response) => {
    try {
        const { productKey } = request.params;

        const reviews = await ReviewCollection.find({ productIdentifier: productKey });

        response.status(200).json(reviews);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/checkout', async (request, response) => {
    try {
        const { cartItems } = request.body;

        const lineItems = cartItems.map((item) => {
            const formattedColor = item.activeColor
                ? `(${item.activeColor.charAt(0).toUpperCase() + item.activeColor.slice(1)})`
                : '';

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${item.name} ${formattedColor}`,
                            images: [item.imageUrl],
                        },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                };
        });

        const origin = request.headers.origin || 'https://woodwork-creations.com/';

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
        return response.status(500).json({ error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(8080, () => console.log("Server running on port 8080"));
}

export default app;