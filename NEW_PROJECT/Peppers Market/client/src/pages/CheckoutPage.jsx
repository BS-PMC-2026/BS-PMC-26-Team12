import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCart } from '../api/cart';
import { checkout } from '../api/orders';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '', address: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const load = async () => {
      try { const { data } = await getCart(); setItems(data); if (!data.length) navigate('/cart'); }
      catch { setError('Failed to load cart.'); }
      finally { setLoading(false); }
    };
    load();
  }, [navigate]);

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv || !form.address)
      return setError('Please fill in all payment details.');
    setPlacing(true); setError('');
    try {
      await checkout();
      navigate('/store', { state: { orderSuccess: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally { setPlacing(false); }
  };

  if (loading) return <div className="min-h-screen bg-dark-300 flex items-center justify-center"><div className="text-cream-muted">Loading…</div></div>;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream mb-10 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-cream font-display mb-10">Checkout</h1>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
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
            <div className="rounded-2xl p-6 mb-4" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="text-lg font-bold text-cream font-display mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-cream-dim">{item.productId.name} × {item.quantity}</span>
                    <span className="text-sm font-bold text-cream">${(item.productId.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cream">Total</span>
                  <span className="text-2xl font-bold text-fire-400">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button onClick={handlePlaceOrder} disabled={placing}
              className="w-full py-4 text-base font-bold rounded-xl text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)', boxShadow: '0 4px 20px rgba(154,43,13,0.35)' }}>
              {placing ? 'Placing Order…' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
