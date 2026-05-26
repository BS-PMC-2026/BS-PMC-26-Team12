require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/peppers',     require('./routes/peppers'));
app.use('/api/guides',      require('./routes/guides'));
app.use('/api/users',       require('./routes/users'));
app.use('/api/products',    require('./routes/products'));
app.use('/api/tours',       require('./routes/tours'));
app.use('/api/tour-orders', require('./routes/tourOrders'));
app.use('/api/cart',        require('./routes/cart'));
app.use('/api/orders',      require('./routes/orders'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

module.exports = app;
