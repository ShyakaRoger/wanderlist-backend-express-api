const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');  

const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const tagRoutes = require('./routes/tagRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to ${mongoose.connection.name}`);
});
mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());

// Using morgan to log all incoming HTTP requests in 'dev' format (you can change to 'combined' for more details)
app.use(morgan('dev'));  // Use the 'dev' format for logging requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/tags', tagRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
