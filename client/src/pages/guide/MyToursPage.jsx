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
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: '#1A1410', border: '1px solid rgba(255,255,255,0.08)' }}>
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
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl text-cream-dim" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
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
              <div key={t._id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h3 className="font-bold text-cream font-display text-lg mb-1">{t.title}</h3>
                <p className="text-cream-dim text-sm line-clamp-2 mb-4">{t.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-cream-muted mb-4">
                  <span>📅 {new Date(t.date).toLocaleDateString()}</span>
                  <span>🕐 {t.time}</span>
                  <span>💰 ${t.price.toFixed(2)}</span>
                  <span>🎟️ {t.bookedSlots}/{t.maxParticipants} booked</span>
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
