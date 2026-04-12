const Guide = require('../models/Guide');

// GET /api/guides — admin
exports.getGuides = async (req, res) => {
  try {
    const guides = await Guide.find().select('-password').sort('-createdAt');
    res.json(guides);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PATCH /api/guides/:id/status — admin (approve / reject)
exports.updateGuideStatus = async (req, res) => {
  const { status } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  try {
    const guide = await Guide.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json(guide);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/guides/:id — admin
exports.deleteGuide = async (req, res) => {
  try {
    const guide = await Guide.findByIdAndDelete(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json({ message: 'Guide deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
