require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/peppers', require('./routes/peppers'));
app.use('/api/guides',  require('./routes/guides'));
app.use('/api/users',   require('./routes/users'));

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
