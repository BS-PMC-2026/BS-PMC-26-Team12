const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true },
    description:     { type: String, required: true, trim: true },
    date:            { type: Date, required: true },
    time:            { type: String, required: true },
    price:           { type: Number, required: true, min: 0 },
    maxParticipants: { type: Number, required: true, min: 1 },
    bookedSlots:     { type: Number, default: 0 },
    guideId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tour', tourSchema);
