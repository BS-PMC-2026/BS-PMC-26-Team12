const User = require('../models/User');
const Tour = require('../models/Tour');

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const user = await User.findById(req.user.id);
    if (user.favorites.map(f => f.toString()).includes(req.params.tourId))
      return res.status(409).json({ message: 'Tour already in favorites' });

    user.favorites.push(req.params.tourId);
    await user.save();
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(f => f.toString() !== req.params.tourId);
    await user.save();
    await user.populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
