const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema(
  {
    fullName:   { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:   { type: String, required: true },
    jobTitle:   { type: String, required: true, trim: true },
    experience: { type: String, trim: true },
    bio:        { type: String, trim: true },
    status:     { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guide', guideSchema);
