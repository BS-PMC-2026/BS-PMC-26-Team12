const Tour = require('../models/Tour');

exports.createTour = async (req, res) => {
  const { title, description, date, time, price, maxParticipants } = req.body;
  if (!title || !description || !date || !time || price == null || !maxParticipants)
    return res.status(400).json({ message: 'All fields are required' });
  if (price < 0 || maxParticipants < 1)
    return res.status(400).json({ message: 'Invalid price or participants count' });
  try {
    const tour = await Tour.create({
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      price,
      maxParticipants,
      guideId: req.user.id,
    });
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTours = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { date: { $gte: new Date() } };
    if (date) {
      const d = new Date(date);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      query.date = { $gte: d, $lt: next };
    }
    const tours = await Tour.find(query).populate('guideId', 'fullName').sort({ date: 1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('guideId', 'fullName');
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyTours = async (req, res) => {
  try {
    const tours = await Tour.find({ guideId: req.user.id }).sort({ date: 1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTour = async (req, res) => {
  const { title, description, date, time, price, maxParticipants } = req.body;
  if (!title || !description || !date || !time || price == null || !maxParticipants)
    return res.status(400).json({ message: 'All fields are required' });
  try {
    const tour = await Tour.findOne({ _id: req.params.id, guideId: req.user.id });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    if (maxParticipants < tour.bookedSlots)
      return res.status(400).json({ message: 'Max participants cannot be less than already booked slots' });

    Object.assign(tour, { title: title.trim(), description: description.trim(), date, time, price, maxParticipants });
    await tour.save();
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
