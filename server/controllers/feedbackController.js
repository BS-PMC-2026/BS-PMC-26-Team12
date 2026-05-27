const TourFeedback = require('../models/TourFeedback');
const TourOrder    = require('../models/TourOrder');

exports.submitFeedback = async (req, res) => {
  const { orderId, rating, comment } = req.body;
  if (!orderId || !rating) return res.status(400).json({ message: 'orderId and rating are required' });
  try {
    const order = await TourOrder.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your booking' });
    if (order.status !== 'confirmed')
      return res.status(400).json({ message: 'Booking is not confirmed' });

    const existing = await TourFeedback.findOne({ orderId });
    if (existing) return res.status(409).json({ message: 'Feedback already submitted for this booking' });

    const feedback = await TourFeedback.create({
      tourId: order.tourId,
      userId: req.user.id,
      orderId,
      rating,
      comment: comment || '',
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await TourFeedback.find({ userId: req.user.id });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTourFeedback = async (req, res) => {
  try {
    const feedbacks = await TourFeedback.find({ tourId: req.params.tourId })
      .populate('userId', 'fullName')
      .sort({ createdAt: -1 });
    const averageRating = feedbacks.length
      ? +(feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
      : 0;
    res.json({ feedbacks, averageRating, totalRatings: feedbacks.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await TourFeedback.find()
      .populate('tourId', 'title')
      .populate('userId', 'fullName')
      .sort({ tourId: 1, createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await TourFeedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
