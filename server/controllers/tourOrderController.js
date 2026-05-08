const Tour = require('../models/Tour');
const TourOrder = require('../models/TourOrder');

exports.bookTour = async (req, res) => {
  const { tourId, numberOfTickets } = req.body;
  if (!tourId || !numberOfTickets || numberOfTickets < 1)
    return res.status(400).json({ message: 'tourId and numberOfTickets are required' });
  try {
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const available = tour.maxParticipants - tour.bookedSlots;
    if (numberOfTickets > available)
      return res.status(400).json({ message: `Only ${available} slots available` });

    const order = await TourOrder.create({
      userId: req.user.id,
      tourId,
      numberOfTickets,
    });

    tour.bookedSlots += numberOfTickets;
    await tour.save();

    const populated = await TourOrder.findById(order._id).populate('tourId');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await TourOrder.find({ userId: req.user.id })
      .populate('tourId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
