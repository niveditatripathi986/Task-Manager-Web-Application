const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');  // Import CORS
const userRoutes = require('./Routes/userRoutes');

dotenv.config();

const app = express();

// Use CORS middleware to allow requests from your frontend (http://localhost:3001)
app.use(cors({
    origin: 'http://localhost:3001',  // Allow requests from this frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(`Error: ${err.message}`));

// Define routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
