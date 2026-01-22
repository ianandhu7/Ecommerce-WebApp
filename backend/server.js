const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const routes = require('./routes');

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health Check Endpoint for Render
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Ecommerce Backend API is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api', routes);

// Database Connection and Server Start
const PORT = process.env.PORT || 5002;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        await sequelize.sync({ alter: true }); // Update tables to match models
        console.log('Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
