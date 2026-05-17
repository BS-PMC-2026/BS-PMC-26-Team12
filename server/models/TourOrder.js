const mongoose = require('mongoose');

const tourOrderSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    numberOfTickets: { type: Number, required: true, min: 1 },
    status:          { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TourOrder', tourOrderSchema);
