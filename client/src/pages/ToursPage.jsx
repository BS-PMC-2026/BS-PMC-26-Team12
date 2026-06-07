import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getTours } from '../api/tours';
import { getFavorites, addFavorite, removeFavorite } from '../api/favorites';

function HeartButton({ isFav, onClick, disabled }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      disabled={disabled}
      title={isFav ? 'Remove from favorites' : 'Save to favorites'}
      className="p-2 rounded-xl transition-all hover:scale-110 disabled:opacity-40"
      style={{ background: isFav ? 'rgba(232,68,32,0.08)' : 'rgba(28,17,10,0.04)', border: `1px solid ${isFav ? 'rgba(232,68,32,0.2)' : 'rgba(28,17,10,0.08)'}` }}>
      <svg className="w-4 h-4" fill={isFav ? '#E84420' : 'none'} stroke={isFav ? '#E84420' : 'currentColor'} strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}

function TourCard({ tour, onBook, isFav, onToggleFav, isVisitor, featured }) {
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(false);
  const available = tour.maxParticipants - tour.bookedSlots;
  const pct = Math.round((tour.bookedSlots / tour.maxParticipants) * 100);

  const handleBook = () => {
    if (tickets < 1 || tickets > available) return setError(`Max ${available} tickets available.`);
    onBook(tour, tickets);
  };

  const handleFav = async () => {
    setToggling(true);
    try { await onToggleFav(tour._id, isFav); }
    finally { setToggling(false); }
  };

  return (
    <div className="glass-card overflow-hidden transition-all hover:shadow-lift group" style={featured ? { borderColor: 'rgba(232,68,32,0.2)' } : {}}>
      {featured && <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #C23610, #E84420, #D4A053)' }} />}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex-1 min-w-0">
            {featured && <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2" style={{ color: '#E84420', background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.15)' }}>Featured</span>}
            <h3 className="font-bold text-cream text-lg font-display leading-snug">{tour.title}</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <span className="text-xl font-bold" style={{ color: '#C23610' }}>${tour.price.toFixed(2)}</span>
              <span className="text-xs text-cream-muted block leading-tight">per ticket</span>
            </div>
            {isVisitor && <HeartButton isFav={isFav} onClick={handleFav} disabled={toggling} />}
          </div>
        </div>

        <p className="text-cream-dim text-sm leading-relaxed line-clamp-2 mb-5">{tour.description}</p>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="flex items-center gap-2 text-xs text-cream-muted">
            <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {new Date(tour.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-xs text-cream-muted">
            <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {tour.time}
          </div>
          <div className="flex items-center gap-2 text-xs text-cream-muted">
            <svg className="w-3.5 h-3.5 flex-shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            {tour.guideId?.fullName || 'Guide'}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold" style={{ color: available > 0 ? '#3D8A24' : '#C23610' }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
            {available > 0 ? `${available} left` : 'Full'}
          </div>
        </div>

        {available > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-cream-muted mb-1">
              <span>Availability</span>
              <span>{pct}% booked</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(28,17,10,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? 'linear-gradient(90deg, #C23610, #E84420)' : 'linear-gradient(90deg, #2D6A1A, #52AB33)' }} />
            </div>
          </div>
        )}

        {error && <p className="text-xs mb-3 font-medium" style={{ color: '#C23610' }}>{error}</p>}
        {available > 0 ? (
          <div className="flex gap-2">
            <input type="number" min={1} max={available} value={tickets} onChange={e => setTickets(Number(e.target.value))}
              className="input-dark w-20 !py-2.5 !text-sm" />
            <button onClick={handleBook}
              className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:shadow-glow group-hover:translate-y-[-1px]"
              style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
              Book Now
            </button>
          </div>
        ) : (
          <div className="py-2.5 text-center text-sm font-bold text-cream-muted rounded-xl" style={{ background: 'rgba(28,17,10,0.04)', border: '1px solid rgba(28,17,10,0.08)' }}>Fully Booked</div>
        )}
      </div>
    </div>
  );
}

export default function ToursPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [favIds, setFavIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const isVisitor = user?.role === 'visitor';

  const load = async (params = {}) => {
    setLoading(true); setError('');
    try { const { data } = await getTours(params); setTours(data); }
    catch { setError('Failed to load tours.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    if (isVisitor) {
      getFavorites().then(({ data }) => setFavIds(new Set(data.map(t => t._id)))).catch(() => {});
    }
  }, [isVisitor]);

  const handleBook = (tour, numberOfTickets) => {
    if (!user) return navigate('/login');
    navigate('/tours/checkout', { state: { tour, numberOfTickets } });
  };

  const handleToggleFav = async (tourId, isFav) => {
    if (!user) return navigate('/login');
    try {
      if (isFav) {
        await removeFavorite(tourId);
        setFavIds(prev => { const n = new Set(prev); n.delete(tourId); return n; });
      } else {
        await addFavorite(tourId);
        setFavIds(prev => new Set([...prev, tourId]));
      }
    } catch {}
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
            {dateFilter && <button onClick={() => { setDateFilter(''); load(); }} className="px-4 py-3 text-sm rounded-xl text-cream-dim" style={{ border: '1px solid rgba(28,17,10,0.12)' }}>Clear</button>}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-20">
        {error && <p className="text-center text-cream-muted py-16">{error}</p>}
        {loading && <div className="grid sm:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="rounded-2xl h-52 animate-pulse" style={{ background: 'rgba(28,17,10,0.05)' }} />)}</div>}
        {!loading && tours.length === 0 && <div className="text-center py-24 text-cream-muted">No upcoming tours available.</div>}
        {!loading && tours.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {tours.map((t, idx) => (
              <TourCard
                key={t._id}
                tour={t}
                onBook={handleBook}
                isFav={favIds.has(t._id)}
                onToggleFav={handleToggleFav}
                isVisitor={isVisitor}
                featured={idx === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
