import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyTours } from '../api/tours';
import { getTourFeedback } from '../api/feedback';

function Stars({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={sz} fill={i <= Math.round(rating) ? '#D4A053' : 'none'} stroke="#D4A053" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </span>
  );
}

export default function GuidePastToursPage() {
  const [tours, setTours] = useState([]);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyTours();
        const past = data.filter(t => new Date(t.date) < new Date());
        setTours(past);

        const entries = await Promise.all(
          past.map(async t => {
            try {
              const { data: fb } = await getTourFeedback(t._id);
              return [t._id, fb];
            } catch {
              return [t._id, { feedbacks: [], averageRating: 0, totalRatings: 0 }];
            }
          })
        );
        setFeedbackMap(Object.fromEntries(entries));
      } catch {
        setError('Failed to load past tours.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/guide" className="inline-flex items-center gap-2.5 mb-8 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-cream font-display mb-2">Past Tours & Ratings</h1>
        <p className="text-cream-dim text-sm mb-10">View visitor feedback for your completed tours.</p>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>}

        {!loading && tours.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.08)' }}>
              <svg className="w-9 h-9" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">No past tours yet</h3>
            <p className="text-cream-muted text-sm">Completed tours will appear here with visitor ratings.</p>
          </div>
        )}

        {!loading && tours.length > 0 && (
          <div className="space-y-4">
            {tours.map(tour => {
              const fb = feedbackMap[tour._id] || { feedbacks: [], averageRating: 0, totalRatings: 0 };
              const isOpen = expanded === tour._id;
              return (
                <div key={tour._id} className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpanded(isOpen ? null : tour._id)}>
                    <div>
                      <p className="font-bold text-cream text-lg font-display">{tour.title}</p>
                      <p className="text-sm text-cream-muted mt-0.5">{new Date(tour.date).toLocaleDateString()} · {tour.bookedSlots} participant{tour.bookedSlots !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {fb.totalRatings > 0 ? (
                          <>
                            <div className="flex items-center gap-1.5 justify-end">
                              <Stars rating={fb.averageRating} />
                              <span className="font-bold text-cream text-sm">{fb.averageRating}</span>
                            </div>
                            <p className="text-xs text-cream-muted">{fb.totalRatings} review{fb.totalRatings !== 1 ? 's' : ''}</p>
                          </>
                        ) : (
                          <p className="text-xs text-cream-muted italic">No ratings yet</p>
                        )}
                      </div>
                      <svg className={`w-4 h-4 text-cream-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t px-5 pb-5 pt-4" style={{ borderColor: 'rgba(28,17,10,0.08)' }}>
                      {fb.feedbacks.length === 0 ? (
                        <p className="text-cream-muted text-sm italic text-center py-4">No ratings yet for this tour.</p>
                      ) : (
                        <div className="space-y-3">
                          {fb.feedbacks.map(f => (
                            <div key={f._id} className="flex gap-3 p-4 rounded-xl" style={{ background: 'rgba(28,17,10,0.025)', border: '1px solid rgba(28,17,10,0.06)' }}>
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                                {f.userId?.fullName?.[0]?.toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-cream text-sm">{f.userId?.fullName || 'Visitor'}</span>
                                  <Stars rating={f.rating} />
                                </div>
                                {f.comment && <p className="text-sm text-cream-dim leading-relaxed">{f.comment}</p>}
                                <p className="text-xs text-cream-muted mt-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
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
