import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

// Connect to MongoDB using Mongoose
mongoose.connect(connectionString)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connection;

// Define the schema for the 'posts' collection with validation rules
const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        minLength: 1 // Minimum length for body
    },
    author: {
        type: String,
        required: true,
        minLength: 1 // Minimum length for author
    },
    title: {
        type: String,
        required: true,
        minLength: 1 // Minimum length for title
    },
    date: {
        type: Date,
        required: true
    }
});

// Define indexes directly in the schema
postSchema.index({ currentDate: -1 });

// Create a model based on the schema and export it
export const Validate = mongoose.model('Post', postSchema);

export default db;
