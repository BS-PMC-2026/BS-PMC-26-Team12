const mongoose = require('mongoose');

const technicalIssueSchema = new mongoose.Schema({
  guideId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true },
  tourId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Tour',  required: true },
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true, trim: true },
  severity:      { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  attachmentUrl: { type: String, default: '' },
  status:        { type: String, enum: ['Pending', 'In Progress', 'Done'], default: 'Pending' },
  managerNotes:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('TechnicalIssue', technicalIssueSchema);
