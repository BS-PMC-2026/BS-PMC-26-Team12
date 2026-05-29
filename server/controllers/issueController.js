const TechnicalIssue = require('../models/TechnicalIssue');
const Tour           = require('../models/Tour');

exports.submitIssue = async (req, res) => {
  const { title, description, tourId, severity } = req.body;
  if (!title || !description || !tourId)
    return res.status(400).json({ message: 'title, description, and tourId are required' });
  try {
    const tour = await Tour.findOne({ _id: tourId, guideId: req.user.id });
    if (!tour) return res.status(404).json({ message: 'Tour not found or not assigned to you' });

    const issue = await TechnicalIssue.create({
      guideId:       req.user.id,
      tourId,
      title:         title.trim(),
      description:   description.trim(),
      severity:      severity || 'Medium',
      attachmentUrl: req.file ? req.file.path : '',
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getIssues = async (req, res) => {
  try {
    const issues = await TechnicalIssue.find()
      .populate('guideId', 'fullName email')
      .populate('tourId', 'title')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateIssueStatus = async (req, res) => {
  const { status, managerNotes } = req.body;
  const valid = ['Pending', 'In Progress', 'Done'];
  if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const issue = await TechnicalIssue.findByIdAndUpdate(
      req.params.id,
      { status, managerNotes: managerNotes || '' },
      { new: true }
    ).populate('guideId', 'fullName email').populate('tourId', 'title');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
