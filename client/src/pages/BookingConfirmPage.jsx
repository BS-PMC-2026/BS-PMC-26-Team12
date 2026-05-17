import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function BookingConfirmPage() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) return (
    <div className="min-h-screen bg-dark-300"><Navbar />
      <div className="text-center py-24"><p className="text-cream-muted mb-4">No booking information found.</p><Link to="/tours" className="text-fire-400">← Back to Tours</Link></div>
    </div>
  );

  const tour = booking.tourId;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl" style={{ background: 'rgba(82,171,51,0.1)' }}>✅</div>
        <h1 className="text-3xl font-bold text-cream font-display mb-2">Booking Confirmed!</h1>
        <p className="text-cream-muted mb-10">Your tour has been successfully booked.</p>

        <div className="rounded-2xl p-6 text-left space-y-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="font-bold text-cream font-display text-lg">{tour?.title}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-cream-muted">Date</span><span className="text-cream font-medium">{tour?.date ? new Date(tour.date).toLocaleDateString() : '—'}</span></div>
            <div className="flex items-center justify-between"><span className="text-cream-muted">Time</span><span className="text-cream font-medium">{tour?.time || '—'}</span></div>
            <div className="flex items-center justify-between"><span className="text-cream-muted">Tickets</span><span className="text-cream font-medium">{booking.numberOfTickets}</span></div>
            <div className="flex items-center justify-between"><span className="text-cream-muted">Total Paid</span><span className="font-bold text-fire-400">${((tour?.price || 0) * booking.numberOfTickets).toFixed(2)}</span></div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Link to="/my-bookings" className="flex-1 py-3 text-sm font-bold rounded-xl text-cream text-center" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.025)' }}>My Bookings</Link>
          <Link to="/tours" className="flex-1 py-3 text-sm font-bold rounded-xl text-white text-center" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>More Tours</Link>
        </div>
      </div>
    </div>
  );
}
