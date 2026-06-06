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

    try {
      const TourOrder = require('../models/TourOrder');
      const { sendEmail } = require('../utils/emailService');
      const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

      const confirmedOrders = await TourOrder.find({
        tourId: tour._id,
        status: 'confirmed',
      }).populate('userId');

      for (const order of confirmedOrders) {
        if (order.userId && order.userId.email) {
          await sendEmail({
            to: order.userId.email,
            subject: `Update: Your booked tour "${esc(tour.title)}" has been modified`,
            html: `
              <h2>Tour Update Notice</h2>
              <p>Hi ${esc(order.userId.fullName)},</p>
              <p>A tour you have booked has been updated with new details:</p>
              <ul>
                <li><strong>Tour:</strong> ${esc(tour.title)}</li>
                <li><strong>Date:</strong> ${esc(new Date(tour.date).toLocaleDateString())}</li>
                <li><strong>Time:</strong> ${esc(tour.time || 'See tour details')}</li>
                <li><strong>Price:</strong> $${esc(tour.price)}</li>
                <li><strong>Max Participants:</strong> ${esc(tour.maxParticipants)}</li>
                <li><strong>Description:</strong> ${esc(tour.description)}</li>
              </ul>
              <p>If you have any concerns, please contact support.</p>
              <p>Thank you for booking with Pepper Farm!</p>
            `,
          });
        }
      }
    } catch (emailErr) {
      console.error('Tour update email error:', emailErr.message);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
