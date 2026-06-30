import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
// Automatically intercepts incoming JSON strings and parses them automatically.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb://Viper:Viper1630@ac-dbwsrkg-shard-00-00.einyqdj.mongodb.net:27017,ac-dbwsrkg-shard-00-01.einyqdj.mongodb.net:27017,ac-dbwsrkg-shard-00-02.einyqdj.mongodb.net:27017/?ssl=true&replicaSet=atlas-odz8bq-shard-0&authSource=admin&appName=CarpentryCluster')
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

app.post('/reviews', async(request, response) => {
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

app.get('/reviews', async (request, response) => {
    try {
        const allReviews = await Review.find();
        response.json(allReviews);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});