import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyBookings } from '../api/tourOrders';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await getMyBookings(); setBookings(data); }
      catch { setError('Failed to load bookings.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/tours" className="inline-flex items-center gap-2.5 mb-8 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Tours
        </Link>
        <h1 className="text-3xl font-bold text-cream font-display mb-10">My Tour Bookings</h1>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}
        {!loading && bookings.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(82,171,51,0.08)' }}>
              <svg className="w-9 h-9" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">No bookings yet</h3>
            <p className="text-cream-muted text-sm mb-6">Reserve a spot on one of our guided tours.</p>
            <Link to="/tours" className="px-6 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>Browse Tours</Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map(b => {
              const tour = b.tourId;
              const isSelected = selected === b._id;
              return (
                <div key={b._id} className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setSelected(isSelected ? null : b._id)}>
                    <div>
                      <p className="font-bold text-cream text-lg font-display">{tour?.title || 'Tour'}</p>
                      <p className="text-sm text-cream-muted mt-0.5">{tour?.date ? new Date(tour.date).toLocaleDateString() : ''} · {tour?.time}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-fire-400">${((tour?.price || 0) * b.numberOfTickets).toFixed(2)}</p>
                        <p className="text-xs text-cream-muted">{b.numberOfTickets} ticket{b.numberOfTickets !== 1 ? 's' : ''}</p>
                      </div>
                      <svg className={`w-4 h-4 text-cream-muted transition-transform ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </button>
                  {isSelected && (
                    <div className="px-5 pb-5 pt-0 border-t" style={{ borderColor: 'rgba(28,17,10,0.08)' }}>
                      <div className="grid grid-cols-2 gap-3 text-sm pt-4">
                        <div><p className="text-cream-muted text-xs uppercase tracking-wider mb-1">Description</p><p className="text-cream-dim">{tour?.description || '—'}</p></div>
                        <div><p className="text-cream-muted text-xs uppercase tracking-wider mb-1">Status</p><p className="text-cream font-medium capitalize">{b.status}</p></div>
                        <div><p className="text-cream-muted text-xs uppercase tracking-wider mb-1">Booked On</p><p className="text-cream-dim">{new Date(b.createdAt).toLocaleDateString()}</p></div>
                        <div><p className="text-cream-muted text-xs uppercase tracking-wider mb-1">Price per Ticket</p><p className="text-cream-dim">${tour?.price?.toFixed(2) || '—'}</p></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
