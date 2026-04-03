const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

console.log('Serverless function loaded');

const app = express();

// Connect to MongoDB
try {
  connectDB();
} catch (err) {
  console.error('DB connection error:', err);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: '✅ API is running' }));

const PORT = process.env.PORT || 5000;

// For local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

// Export for Netlify serverless
module.exports.handler = serverless(app);