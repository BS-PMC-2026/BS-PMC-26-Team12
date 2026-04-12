const mongoose = require('mongoose');

const pepperSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    imageUrl:    { type: String, trim: true, default: '' },
    origin:      { type: String, trim: true, default: '' },
    color:       { type: String, trim: true, default: '' },
    heatLevel:   { type: String, enum: ['None', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme'], default: 'Medium' },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Text index for fast partial name search
pepperSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Pepper', pepperSchema);
