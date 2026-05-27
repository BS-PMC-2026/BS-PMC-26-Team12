const mongoose = require('mongoose');

const tourFeedbackSchema = new mongoose.Schema({
  tourId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Tour',      required: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',      required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourOrder', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, default: '' },
}, { timestamps: true });

tourFeedbackSchema.index({ orderId: 1 }, { unique: true });

module.exports = mongoose.model('TourFeedback', tourFeedbackSchema);
