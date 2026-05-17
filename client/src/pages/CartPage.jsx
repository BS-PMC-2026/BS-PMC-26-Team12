import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCart, updateCartItem, removeFromCart } from '../api/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try { const { data } = await getCart(); setItems(data); }
    catch { setError('Failed to load cart.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleQtyChange = async (item, qty) => {
    if (qty < 1) return;
    try {
      const { data } = await updateCartItem(item._id, { quantity: qty });
      setItems(p => p.map(x => x._id === item._id ? data : x));
    } catch (err) { setError(err.response?.data?.message || 'Failed to update.'); }
  };

  const handleRemove = async (id) => {
    try { await removeFromCart(id); setItems(p => p.filter(x => x._id !== id)); }
    catch { setError('Failed to remove item.'); }
  };

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/store" className="inline-flex items-center gap-2.5 mb-8 text-sm font-medium transition-all group" style={{ color: '#9B7260' }}>
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(28,17,10,0.06)', border: '1px solid rgba(28,17,10,0.09)' }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </span>
          Back to Store
        </Link>
        <h1 className="text-3xl font-bold text-cream font-display mb-10">Your Cart</h1>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}

        {!loading && items.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.08)' }}>
              <svg className="w-9 h-9" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">Your cart is empty</h3>
            <p className="text-cream-muted text-sm mb-6">Browse our store to find something you like.</p>
            <Link to="/store" className="px-6 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>Go to Store</Link>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div key={item._id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(28,17,10,0.04)' }}>
                    {item.productId.imageUrl ? <img src={item.productId.imageUrl} alt={item.productId.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><svg className="w-6 h-6" style={{ color: 'rgba(28,17,10,0.20)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-cream truncate">{item.productId.name}</p>
                    <p className="text-sm text-fire-400">${item.productId.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQtyChange(item, item.quantity - 1)} className="w-7 h-7 rounded-lg text-cream-dim flex items-center justify-center transition-colors hover:text-cream" style={{ background: 'rgba(28,17,10,0.07)' }}>−</button>
                    <span className="w-8 text-center text-cream font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item, item.quantity + 1)} className="w-7 h-7 rounded-lg text-cream-dim flex items-center justify-center transition-colors hover:text-cream" style={{ background: 'rgba(28,17,10,0.07)' }}>+</button>
                  </div>
                  <p className="font-bold text-cream w-16 text-right">${(item.productId.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => handleRemove(item._id)} className="text-cream-muted hover:text-fire-400 transition-colors ml-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6 h-fit" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
              <h2 className="text-lg font-bold text-cream font-display mb-5">Order Summary</h2>
              <div className="flex items-center justify-between mb-2">
                <span className="text-cream-dim text-sm">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                <span className="text-cream font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="my-4" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }} />
              <div className="flex items-center justify-between mb-6">
                <span className="text-cream font-bold">Total</span>
                <span className="text-2xl font-bold text-fire-400">${total.toFixed(2)}</span>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
                Proceed to Checkout
              </button>
              <Link to="/store" className="block mt-3 text-center text-sm text-cream-muted hover:text-cream transition-colors">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
