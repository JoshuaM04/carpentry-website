import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
// Automatically intercepts incoming JSON strings and parses them automatically.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Succesfully connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const reviewSchema = new mongoose.Schema({
    title: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true},
    productIdentifier: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const ReviewCollection = mongoose.models.Review || mongoose.model('Review', reviewSchema);

const connectDB = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");

        return next();
    } catch (error) {
        console.error("Database connection failed:", error);
        return res.status(500).json({ success: false, error: "Database connection failed", mongoError: error.message });
    }
}

app.post('/reviews/:productKey', connectDB, async(request, response) => {
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

app.get('/reviews/:productKey', connectDB, async (request, response) => {
    try {
        const { productKey } = request.params;

        const reviews = await ReviewCollection.find({ productIdentifier: productKey });

        response.status(200).json(reviews);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(8080, () => console.log("Server running on port 8080"));
}

export default app;