const cron      = require('node-cron');
const Tour      = require('../models/Tour');
const TourOrder = require('../models/TourOrder');
const { sendEmail } = require('../utils/emailService');

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const safeHeader = s => String(s ?? '').replace(/[\r\n]/g, ' ').slice(0, 200);

// Combine tour.date (midnight) + tour.time ("HH:MM") into a single Date
const getTourDateTime = (tour) => {
  const dt = new Date(tour.date);
  if (tour.time) {
    const [h, m] = tour.time.split(':').map(Number);
    if (!isNaN(h) && !isNaN(m)) dt.setUTCHours(h, m, 0, 0);
  }
  return dt;
};

const startReminderJob = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('Running reminder job...');

    const now   = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    try {
      // Query a wide window (now → now+49h) because tour.date is stored as midnight
      // and the actual tour time is in a separate `time` string field.
      // We filter precisely to the 24-25h window in JS after combining date+time.
      const broadEnd = new Date(now.getTime() + 49 * 60 * 60 * 1000);
      const candidates = await Tour.find({
        date: { $gte: now, $lte: broadEnd },
      }).populate('guideId');

      const upcomingTours = candidates.filter(tour => {
        const dt = getTourDateTime(tour);
        return dt >= in24h && dt <= in25h;
      });

      for (const tour of upcomingTours) {
        const tourDateTime = getTourDateTime(tour);
        const displayDate  = tourDateTime.toLocaleDateString();
        const displayTime  = tour.time || tourDateTime.toLocaleTimeString();

        // Guide reminder
        if (tour.guideId?.email) {
          const guide = tour.guideId;
          await sendEmail({
            to: guide.email,
            subject: `Reminder: Your tour "${safeHeader(tour.title)}" is tomorrow`,
            html: `
              <h2>Tour Reminder</h2>
              <p>Hi ${esc(guide.fullName)},</p>
              <p>This is a reminder that you have a tour scheduled tomorrow.</p>
              <ul>
                <li><strong>Tour:</strong> ${esc(tour.title)}</li>
                <li><strong>Date:</strong> ${esc(displayDate)}</li>
                <li><strong>Time:</strong> ${esc(displayTime)}</li>
                <li><strong>Participants:</strong> ${esc(tour.bookedSlots)}</li>
              </ul>
              <p>${esc(tour.description || '')}</p>
              <p>Good luck!</p>
            `,
          });
        }

        // Visitor reminders
        const orders = await TourOrder.find({ tourId: tour._id, status: 'confirmed' }).populate('userId');
        for (const order of orders) {
          if (order.userId?.email) {
            const visitor = order.userId;
            await sendEmail({
              to: visitor.email,
              subject: `Reminder: Your tour "${safeHeader(tour.title)}" is tomorrow`,
              html: `
                <h2>Tour Reminder</h2>
                <p>Hi ${esc(visitor.fullName)},</p>
                <p>This is a reminder that you have a tour booked for tomorrow!</p>
                <ul>
                  <li><strong>Tour:</strong> ${esc(tour.title)}</li>
                  <li><strong>Date:</strong> ${esc(displayDate)}</li>
                  <li><strong>Time:</strong> ${esc(displayTime)}</li>
                  <li><strong>Tickets:</strong> ${esc(order.numberOfTickets)}</li>
                </ul>
                <p>We look forward to seeing you!</p>
              `,
            });
          }
        }
      }
    } catch (err) {
      console.error('Reminder job error:', err.message);
    }
  });

  console.log('Reminder cron job started');
};

module.exports = { startReminderJob };
