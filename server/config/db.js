import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        // MongoDB Connection
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/epms')
            .then(() => console.log('Connected to MongoDB'))
            .catch((err) => console.error('MongoDB connection error:', err));

    } catch (error) {
        console.error(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}