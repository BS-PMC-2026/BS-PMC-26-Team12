import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { bookTour } from '../api/tourOrders';

export default function TourCheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const tour = state?.tour;
  const numberOfTickets = state?.numberOfTickets ?? 1;

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '', address: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!tour) return (
    <div className="min-h-screen bg-dark-300"><Navbar />
      <div className="text-center py-24"><p className="text-cream-muted mb-4">No tour selected.</p><Link to="/tours" className="text-fire-400">← Back to Tours</Link></div>
    </div>
  );

  const total = (tour.price * numberOfTickets).toFixed(2);

  const handleBook = async () => {
    if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv || !form.address)
      return setError('Please fill in all payment details.');
    setPlacing(true); setError('');
    try {
      const { data } = await bookTour({ tourId: tour._id, numberOfTickets });
      navigate('/tours/confirm', { state: { booking: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally { setPlacing(false); }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/tours" className="inline-flex items-center gap-2.5 mb-10 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Tours
        </Link>
        <h1 className="text-3xl font-bold text-cream font-display mb-10">Tour Checkout</h1>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
            <h2 className="text-lg font-bold text-cream font-display mb-5">Payment Details</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Cardholder Name</label><input className="input-dark w-full" placeholder="John Doe" value={form.cardName} onChange={e => set('cardName', e.target.value)} /></div>
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Card Number</label><input className="input-dark w-full" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={e => set('cardNumber', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Expiry</label><input className="input-dark w-full" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={e => set('expiry', e.target.value)} /></div>
                <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">CVV</label><input className="input-dark w-full" placeholder="123" maxLength={4} value={form.cvv} onChange={e => set('cvv', e.target.value)} /></div>
              </div>
              <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Billing Address</label><textarea className="input-dark w-full resize-none" rows={2} placeholder="123 Main St, City, Country" value={form.address} onChange={e => set('address', e.target.value)} /></div>
            </div>
          </div>

          <div>
            <div className="rounded-2xl p-6 mb-4" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
              <h2 className="text-lg font-bold text-cream font-display mb-4">Booking Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm text-cream-dim">{tour.title}</span>
                  <span className="text-sm font-bold text-cream">${tour.price.toFixed(2)} / ticket</span>
                </div>
                <div className="flex items-center justify-between text-xs text-cream-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(tour.date).toLocaleDateString()}
                  </span>
                  <span>{tour.time}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-cream-dim">
                  <span>Tickets</span>
                  <span className="font-medium">{numberOfTickets}</span>
                </div>
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream">Total</span>
                  <span className="text-2xl font-bold text-fire-400">${total}</span>
                </div>
              </div>
            </div>
            <button onClick={handleBook} disabled={placing}
              className="w-full py-4 text-base font-bold rounded-xl text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)', boxShadow: '0 4px 20px rgba(154,43,13,0.35)' }}>
              {placing ? 'Booking…' : `Confirm Booking — $${total}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
