import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { getMyTours, updateTour } from '../../api/tours';

function EditModal({ tour, onSave, onClose }) {
  const [form, setForm] = useState({
    title: tour.title, description: tour.description,
    date: tour.date?.split('T')[0] || '', time: tour.time,
    price: tour.price, maxParticipants: tour.maxParticipants,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date || !form.time || form.price === '' || !form.maxParticipants)
      return setError('All fields are required.');
    if (Number(form.maxParticipants) < tour.bookedSlots)
      return setError(`Max participants cannot be less than ${tour.bookedSlots} (already booked).`);
    setLoading(true); setError('');
    try {
      const { data } = await updateTour(tour._id, { ...form, price: Number(form.price), maxParticipants: Number(form.maxParticipants) });
      onSave(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update tour.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.10)' }}>
        <h2 className="text-lg font-bold text-cream font-display mb-5">Edit Tour</h2>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Title</label><input className="input-dark w-full" value={form.title} onChange={e => set('title', e.target.value)} /></div>
          <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Description</label><textarea className="input-dark w-full resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Date</label><input type="date" className="input-dark w-full" value={form.date} onChange={e => set('date', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Time</label><input type="time" className="input-dark w-full" value={form.time} onChange={e => set('time', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Price ($)</label><input type="number" min="0" step="0.01" className="input-dark w-full" value={form.price} onChange={e => set('price', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Max Participants</label><input type="number" min={tour.bookedSlots || 1} className="input-dark w-full" value={form.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} /></div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl text-cream-dim" style={{ border: '1px solid rgba(28,17,10,0.10)' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function MyToursPage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try { const { data } = await getMyTours(); setTours(data); }
      catch { setError('Failed to load tours.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      {editing && <EditModal tour={editing} onSave={updated => { setTours(p => p.map(t => t._id === updated._id ? updated : t)); setEditing(null); }} onClose={() => setEditing(null)} />}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/guide" className="inline-flex items-center gap-2.5 mb-8 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-cream font-display mb-1">My Tours</h1>
            <p className="text-cream-muted text-sm">{tours.length} tour{tours.length !== 1 ? 's' : ''} created</p>
          </div>
          <Link to="/guide/tours/create" className="px-5 py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>+ Create Tour</Link>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}
        {!loading && tours.length === 0 && <div className="text-center py-24 text-cream-muted">No tours yet. <Link to="/guide/tours/create" className="text-fire-400">Create one.</Link></div>}

        {!loading && tours.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-5">
            {tours.map(t => (
              <div key={t._id} className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                <h3 className="font-bold text-cream font-display text-lg mb-1">{t.title}</h3>
                <p className="text-cream-dim text-sm line-clamp-2 mb-4">{t.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-cream-muted mb-4">
                  <span className="flex items-center gap-1"><svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>{new Date(t.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{t.time}</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>${t.price.toFixed(2)}</span>
                  <span className="flex items-center gap-1"><svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>{t.bookedSlots}/{t.maxParticipants} booked</span>
                </div>
                <button onClick={() => setEditing(t)} className="w-full py-2 text-sm font-bold rounded-xl transition-all" style={{ background: 'rgba(212,160,83,0.08)', color: '#D4A053', border: '1px solid rgba(212,160,83,0.15)' }}>Edit Tour</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
