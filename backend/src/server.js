import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
// Automatically intercepts incoming JSON strings and parses them automatically.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true},
    productIdentifier: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ReviewCollection = mongoose.models.Review || mongoose.model('Review', reviewSchema);

let cachedConnection = null;

const connectDB = async (request, response, next) => {
    // 1. Guard check for the environment variable
    if (!process.env.MONGODB_URI) {
        console.error("CRITICAL: MONGODB_URI missing from environment variables.");
        return response.status(500).json({ success: false, error: "Database configuration missing." });
    }

    // 2. If already connected (readyState 1), move straight to the next handler
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    // 3. If a connection is already in progress, wait for it to finish instead of making a new one
    if (mongoose.connection.readyState === 2) {
        console.log("Database is already connecting. Waiting for resolution...");
        try {
            await cachedConnection;
            return next();
        } catch (error) {
            return response.status(500).json({ success: false, error: "Cached connection failed", details: error.message });
        }
    }

    // 4. No connection exists yet. Create a fresh one and cache the promise.
    try {
        console.log("Initializing brand new MongoDB Atlas connection...");
        
        // Configuration options optimize performance for serverless environments
        cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false, // Stop mongoose from delaying queries if connection drops briefly
        });

        await cachedConnection;
        console.log("Successfully connected to MongoDB Atlas!");
        return next();
    } catch (error) {
        console.error("Database connection failed completely:", error);
        return response.status(500).json({ 
            success: false, 
            error: "Database connection failed", 
            mongoError: error.message 
        });
    }
}

app.post('/api/reviews/:productKey', connectDB, async(request, response) => {
    try {
        const { productKey } = request.params;
        const { title, rating, comment, username, email } = request.body;

        const newReview = await ReviewCollection.create({
            productIdentifier: productKey,
            title,
            rating,
            comment,
            username,
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

app.get('/api/reviews', connectDB, async (request, response) => {
    try {
        const allReviews = await ReviewCollection.find({});
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.use('/api/reviews', app);
app.use('/reviews', app);

if (process.env.NODE_ENV !== 'production') {
    app.listen(8080, () => console.log("Server running on port 8080"));
}

export default app;