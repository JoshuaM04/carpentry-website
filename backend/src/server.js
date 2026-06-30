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
    timestamp: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

const connectDB = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Database connection failed:", error);
        return res.status(500).json({ success: false, error: "Database connection failed" });
    }
}

app.post('/reviews', conntectDB, async(request, response) => {
    try {
        const { title, rating, comment, username, email } = request.body;

        const newReview = new Review({ title, rating, comment, username, email });

        const savedReview = await newReview.save();

        response.status(201).json({
            success: true,
            data: savedReview
        })
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.get('/reviews', connectDB, async (request, response) => {
    try {
        const allReviews = await Review.find();
        response.json(allReviews);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(8080, () => console.log("Server running on port 8080"));
}

export default app;