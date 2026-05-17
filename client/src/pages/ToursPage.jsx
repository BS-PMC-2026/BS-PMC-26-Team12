import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getTours } from '../api/tours';
import { bookTour } from '../api/tourOrders';

function TourCard({ tour, onBook }) {
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const available = tour.maxParticipants - tour.bookedSlots;

  const handleBook = async () => {
    if (tickets < 1 || tickets > available) return setError(`Max ${available} tickets available.`);
    setBooking(true); setError('');
    try { await onBook(tour._id, tickets); }
    catch (err) { setError(err.response?.data?.message || 'Booking failed.'); setBooking(false); }
  };

  return (
    <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-cream text-lg font-display">{tour.title}</h3>
        <span className="text-lg font-bold text-fire-400">${tour.price.toFixed(2)}</span>
      </div>
      <p className="text-cream-dim text-sm leading-relaxed line-clamp-2 mb-4">{tour.description}</p>
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-cream-muted">
        <span className="flex items-center gap-1">📅 {new Date(tour.date).toLocaleDateString()}</span>
        <span className="flex items-center gap-1">🕐 {tour.time}</span>
        <span className="flex items-center gap-1">👤 {tour.guideId?.fullName || 'Guide'}</span>
        <span className="flex items-center gap-1" style={{ color: available > 0 ? '#52AB33' : '#E84420' }}>
          🎟️ {available} slot{available !== 1 ? 's' : ''} left
        </span>
      </div>
      {error && <p className="text-xs mb-3" style={{ color: '#E84420' }}>{error}</p>}
      {available > 0 ? (
        <div className="flex gap-2">
          <input type="number" min={1} max={available} value={tickets} onChange={e => setTickets(Number(e.target.value))}
            className="input-dark w-20 !py-2 !text-sm" />
          <button onClick={handleBook} disabled={booking}
            className="flex-1 py-2 text-sm font-bold rounded-xl text-white disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
            {booking ? 'Booking…' : 'Book Now'}
          </button>
        </div>
      ) : (
        <div className="py-2 text-center text-sm font-bold text-cream-muted rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>Fully Booked</div>
      )}
    </div>
  );
}

export default function ToursPage() {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const load = async (params = {}) => {
    setLoading(true); setError('');
    try { const { data } = await getTours(params); setTours(data); }
    catch { setError('Failed to load tours.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleBook = async (tourId, numberOfTickets) => {
    const { data } = await bookTour({ tourId, numberOfTickets });
    navigate('/tours/confirm', { state: { booking: data } });
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="relative overflow-hidden py-16 text-center px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(82,171,51,0.08), transparent)' }} />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#52AB33' }} /> Farm Tours
          </div>
          <h1 className="text-4xl font-bold text-cream font-display mb-3">Book a Tour</h1>
          <p className="text-cream-dim text-base mb-8">Reserve your spot on a guided farm tour.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="date" className="input-dark flex-1 !py-3" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
            <button onClick={() => load(dateFilter ? { date: dateFilter } : {})} className="px-5 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>Filter</button>
            {dateFilter && <button onClick={() => { setDateFilter(''); load(); }} className="px-4 py-3 text-sm rounded-xl text-cream-dim" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Clear</button>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-20">
        {error && <p className="text-center text-cream-muted py-16">{error}</p>}
        {loading && <div className="grid sm:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-2xl h-52 animate-pulse" style={{ background: 'rgba(255,255,255,0.025)' }} />)}</div>}
        {!loading && tours.length === 0 && <div className="text-center py-24 text-cream-muted">No upcoming tours available.</div>}
        {!loading && tours.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {tours.map(t => <TourCard key={t._id} tour={t} onBook={handleBook} />)}
          </div>
        )}
      </div>
    </div>
  );
}
