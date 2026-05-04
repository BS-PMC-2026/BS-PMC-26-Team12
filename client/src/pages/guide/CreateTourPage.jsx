import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { createTour } from '../../api/tours';

export default function CreateTourPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', price: '', maxParticipants: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    if (!form.title || !form.description || !form.date || !form.time || form.price === '' || form.maxParticipants === '')
      return 'All fields are required.';
    if (Number(form.price) < 0) return 'Price must be non-negative.';
    if (Number(form.maxParticipants) < 1) return 'Must allow at least 1 participant.';
    if (new Date(form.date) < new Date()) return 'Tour date must be in the future.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setLoading(true); setError('');
    try {
      await createTour({ ...form, price: Number(form.price), maxParticipants: Number(form.maxParticipants) });
      navigate('/guide/tours');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create tour.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/guide/tours" className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          My Tours
        </Link>

        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h1 className="text-2xl font-bold text-cream font-display mb-2">Create New Tour</h1>
          <p className="text-cream-muted text-sm mb-8">Schedule a new guided farm tour for visitors.</p>

          {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420', border: '1px solid rgba(232,68,32,0.2)' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Tour Title *</label><input className="input-dark w-full" placeholder="e.g. Morning Harvest Walk" value={form.title} onChange={e => set('title', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Description *</label><textarea className="input-dark w-full resize-none" rows={4} placeholder="Describe the tour experience..." value={form.description} onChange={e => set('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Date *</label><input type="date" className="input-dark w-full" value={form.date} onChange={e => set('date', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Time *</label><input type="time" className="input-dark w-full" value={form.time} onChange={e => set('time', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Price per Ticket ($) *</label><input type="number" min="0" step="0.01" className="input-dark w-full" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Max Participants *</label><input type="number" min="1" className="input-dark w-full" placeholder="10" value={form.maxParticipants} onChange={e => set('maxParticipants', e.target.value)} /></div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold rounded-xl text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>{loading ? 'Creating…' : 'Create Tour'}</button>
              <Link to="/guide/tours" className="px-6 py-3 text-sm font-bold rounded-xl text-cream-dim text-center" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
