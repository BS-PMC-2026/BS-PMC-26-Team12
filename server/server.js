require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Sprint 1
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/peppers', require('./routes/peppers'));
app.use('/api/guides',  require('./routes/guides'));
app.use('/api/users',   require('./routes/users'));

// Sprint 2
app.use('/api/products',    require('./routes/products'));
app.use('/api/tours',       require('./routes/tours'));
app.use('/api/tour-orders', require('./routes/tourOrders'));
app.use('/api/cart',        require('./routes/cart'));
app.use('/api/orders',      require('./routes/orders'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

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
