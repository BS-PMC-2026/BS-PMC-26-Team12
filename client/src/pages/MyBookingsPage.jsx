import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyBookings } from '../api/tourOrders';
import { submitFeedback, getMyFeedback } from '../api/feedback';

function Stars({ rating, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || rating;
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i} type="button"
          onClick={() => onChange && onChange(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}>
          <svg className="w-6 h-6" fill={i <= active ? '#D4A053' : 'none'} stroke="#D4A053" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>
      ))}
    </span>
  );
}

function RateModal({ booking, onClose, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!rating) return setError('Please select a star rating.');
    setSubmitting(true); setError('');
    try {
      await submitFeedback({ orderId: booking._id, rating, comment });
      onSubmitted(booking._id, rating);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.10)' }}>
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #D4A053, #E88C20)' }} />
        <div className="p-6">
          <h3 className="font-bold text-cream text-xl font-display mb-1">Rate Your Experience</h3>
          <p className="text-cream-dim text-sm mb-5">{booking.tourId?.title}</p>

          {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-cream-muted mb-2">Your Rating *</label>
            <Stars rating={rating} onChange={setRating} />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-cream-muted mb-2">Comment (optional)</label>
            <textarea
              className="input-dark w-full resize-none"
              rows={3}
              placeholder="Share your experience..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="btn-ghost px-5 py-2.5 text-sm flex-1">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting || !rating} className="btn-fire px-6 py-2.5 text-sm flex-1">
              {submitting ? 'Submitting…' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [ratedOrders, setRatedOrders] = useState(new Set());
  const [ratingMap, setRatingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: b }, { data: myFb }] = await Promise.all([getMyBookings(), getMyFeedback()]);
        setBookings(b);
        const rated = new Set(myFb.map(f => f.orderId));
        const rMap = Object.fromEntries(myFb.map(f => [f.orderId, f.rating]));
        setRatedOrders(rated);
        setRatingMap(rMap);
      } catch {
        setError('Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRated = (orderId, rating) => {
    setRatedOrders(prev => new Set([...prev, orderId]));
    setRatingMap(prev => ({ ...prev, [orderId]: rating }));
    setRatingBooking(null);
  };

  const isPast = (tour) => tour?.date && new Date(tour.date) < new Date();

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      {ratingBooking && (
        <RateModal booking={ratingBooking} onClose={() => setRatingBooking(null)} onSubmitted={handleRated} />
      )}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/tours" className="inline-flex items-center gap-2.5 mb-10 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Tours
        </Link>
        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.06)', border: '1px solid rgba(82,171,51,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#52AB33' }} /> Visitor
            </div>
            <h1 className="text-3xl font-bold text-cream font-display">My Tour Bookings</h1>
          </div>
          {bookings.length > 0 && <div className="text-right flex-shrink-0 pt-1">
            <p className="text-2xl font-bold text-cream font-display">{bookings.length}</p>
            <p className="text-xs text-cream-muted">booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>}
        </div>

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
              const past = isPast(tour);
              const alreadyRated = ratedOrders.has(b._id);
              const statusStyle = b.status === 'confirmed'
                ? { color: '#3D8A24', bg: 'rgba(82,171,51,0.08)', border: 'rgba(82,171,51,0.2)' }
                : { color: '#C23610', bg: 'rgba(232,68,32,0.08)', border: 'rgba(232,68,32,0.2)' };
              return (
                <div key={b._id} className="glass-card overflow-hidden">
                  {past && <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, rgba(212,160,83,0.4), rgba(212,160,83,0.1))' }} />}
                  <button className="w-full flex items-start gap-4 p-5 text-left" onClick={() => setSelected(isSelected ? null : b._id)}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: past ? 'rgba(212,160,83,0.08)' : 'rgba(82,171,51,0.08)', border: `1px solid ${past ? 'rgba(212,160,83,0.2)' : 'rgba(82,171,51,0.2)'}` }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: past ? '#D4A053' : '#52AB33' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-cream text-base font-display leading-snug">{tour?.title || 'Tour'}</p>
                          <p className="text-xs text-cream-muted mt-0.5">{tour?.date ? new Date(tour.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''} · {tour?.time}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <p className="font-bold text-cream">${((tour?.price || 0) * b.numberOfTickets).toFixed(2)}</p>
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5" style={{ color: statusStyle.color, background: statusStyle.bg, border: `1px solid ${statusStyle.border}` }}>{b.status}</span>
                          </div>
                          <svg className={`w-4 h-4 text-cream-muted transition-transform flex-shrink-0 ${isSelected ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                    </div>
                  </button>
                  {isSelected && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(28,17,10,0.07)' }}>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm pt-4">
                        <div><p className="text-cream-muted text-[10px] uppercase tracking-wider font-bold mb-1">Tickets</p><p className="text-cream font-bold">{b.numberOfTickets}</p></div>
                        <div><p className="text-cream-muted text-[10px] uppercase tracking-wider font-bold mb-1">Per Ticket</p><p className="text-cream font-bold">${tour?.price?.toFixed(2) || '—'}</p></div>
                        <div><p className="text-cream-muted text-[10px] uppercase tracking-wider font-bold mb-1">Booked On</p><p className="text-cream-dim">{new Date(b.createdAt).toLocaleDateString()}</p></div>
                        <div><p className="text-cream-muted text-[10px] uppercase tracking-wider font-bold mb-1">Guide</p><p className="text-cream-dim">{tour?.guideId?.fullName || '—'}</p></div>
                      </div>
                      {tour?.description && (
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(28,17,10,0.06)' }}>
                          <p className="text-cream-muted text-[10px] uppercase tracking-wider font-bold mb-1">Description</p>
                          <p className="text-sm text-cream-dim leading-relaxed">{tour.description}</p>
                        </div>
                      )}
                      {past && b.status === 'confirmed' && (
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
                          {alreadyRated ? (
                            <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#D4A053' }}>
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                              You rated this {ratingMap[b._id]}/5 — thanks!
                            </div>
                          ) : (
                            <button
                              onClick={() => setRatingBooking(b)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                              style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.2)' }}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                              Rate This Tour
                            </button>
                          )}
                        </div>
                      )}
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
