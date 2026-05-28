import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getFavorites, removeFavorite } from '../api/favorites';

export default function MyFavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(({ data }) => setFavorites(data))
      .catch(() => setError('Failed to load favorites.'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (tourId) => {
    setRemoving(tourId);
    try {
      const { data } = await removeFavorite(tourId);
      setFavorites(data);
    } catch {
      setError('Failed to remove favorite.');
    } finally {
      setRemoving(null);
    }
  };

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
        <h1 className="text-3xl font-bold text-cream font-display mb-10">My Favorite Tours</h1>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card h-32 animate-pulse" />)}</div>}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.08)' }}>
              <svg className="w-9 h-9" style={{ color: '#E84420' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">No favorites yet</h3>
            <p className="text-cream-muted text-sm mb-6">Save tours you love and find them here quickly.</p>
            <Link to="/tours" className="px-6 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>Browse Tours</Link>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {favorites.map(tour => {
              const available = tour.maxParticipants - tour.bookedSlots;
              return (
                <div key={tour._id} className="rounded-2xl p-6 relative" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-cream text-lg font-display pr-2">{tour.title}</h3>
                    <span className="text-lg font-bold text-fire-400 flex-shrink-0">${tour.price?.toFixed(2)}</span>
                  </div>
                  <p className="text-cream-dim text-sm leading-relaxed line-clamp-2 mb-4">{tour.description}</p>
                  <div className="flex flex-wrap gap-3 mb-5 text-xs text-cream-muted">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(tour.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5" style={{ color: available > 0 ? '#52AB33' : '#E84420' }}>
                      <svg className="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                      {available} slot{available !== 1 ? 's' : ''} left
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/tours')}
                      className="flex-1 py-2 text-sm font-bold rounded-xl text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
                      Book Now
                    </button>
                    <button
                      onClick={() => handleRemove(tour._id)}
                      disabled={removing === tour._id}
                      className="px-3 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-40"
                      style={{ color: '#E84420', border: '1px solid rgba(232,68,32,0.2)', background: 'rgba(232,68,32,0.05)' }}
                      title="Remove from favorites">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
