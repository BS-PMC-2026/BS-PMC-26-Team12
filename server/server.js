require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const { startReminderJob } = require('./jobs/reminderJob');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    startReminderJob();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
