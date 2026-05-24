import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCart, updateCartItem, removeFromCart } from '../api/cart';

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await getCart();
      setItems(data);
      setSelected(new Set(data.map(i => i._id)));
    } catch { setError('Failed to load cart.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const toggleItem = (id) => setSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const allSelected = items.length > 0 && selected.size === items.length;
  const noneSelected = selected.size === 0;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map(i => i._id)));

  const handleQtyChange = async (item, qty) => {
    if (qty < 1 || qty > item.productId.stock) return;
    try {
      const { data } = await updateCartItem(item._id, { quantity: qty });
      setItems(p => p.map(x => x._id === item._id ? data : x));
    } catch (err) { setError(err.response?.data?.message || 'Failed to update.'); }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setItems(p => p.filter(x => x._id !== id));
      setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
    } catch { setError('Failed to remove item.'); }
  };

  const selectedItems = items.filter(i => selected.has(i._id));
  const total = selectedItems.reduce((sum, i) => sum + i.productId.price * i.quantity, 0);

  const handleCheckout = () => {
    if (noneSelected) return;
    navigate('/checkout', { state: { selectedItemIds: [...selected] } });
  };

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
            <div className="lg:col-span-2">

              {/* Select-all header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <span className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="sr-only"
                    />
                    <span className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{
                        background: allSelected ? 'linear-gradient(135deg, #9A2B0D, #C23610)' : '#FFFFFF',
                        border: `2px solid ${allSelected ? '#C23610' : 'rgba(28,17,10,0.2)'}`,
                      }}
                      onClick={toggleAll}>
                      {allSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                      {!allSelected && selected.size > 0 && <span className="w-1.5 h-0.5 rounded" style={{ background: '#C23610' }} />}
                    </span>
                  </span>
                  <span className="text-xs font-bold text-cream-muted uppercase tracking-wider">
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </span>
                </label>
                <span className="text-xs text-cream-muted">
                  {selected.size} of {items.length} item{items.length !== 1 ? 's' : ''} selected
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map(item => {
                  const isSelected = selected.has(item._id);
                  const atMax = item.quantity >= item.productId.stock;
                  return (
                    <div key={item._id}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200"
                      style={{
                        background: '#FFFFFF',
                        border: `1px solid ${isSelected ? 'rgba(28,17,10,0.08)' : 'rgba(28,17,10,0.04)'}`,
                        opacity: isSelected ? 1 : 0.45,
                      }}>

                      {/* Custom checkbox */}
                      <span className="relative flex-shrink-0 cursor-pointer"
                        onClick={() => toggleItem(item._id)}>
                        <span className="w-4 h-4 rounded flex items-center justify-center transition-all"
                          style={{
                            background: isSelected ? 'linear-gradient(135deg, #9A2B0D, #C23610)' : '#FFFFFF',
                            border: `2px solid ${isSelected ? '#C23610' : 'rgba(28,17,10,0.2)'}`,
                            display: 'flex',
                          }}>
                          {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                        </span>
                      </span>

                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(28,17,10,0.04)' }}>
                        {item.productId.imageUrl
                          ? <img src={item.productId.imageUrl} alt={item.productId.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center"><svg className="w-6 h-6" style={{ color: 'rgba(28,17,10,0.20)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                        }
                      </div>

                      {/* Name + unit price */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-cream truncate">{item.productId.name}</p>
                        <p className="text-sm text-fire-400">${item.productId.price.toFixed(2)} each</p>
                        {item.productId.stock <= 5 && (
                          <p className="text-xs mt-0.5" style={{ color: '#D4A053' }}>Only {item.productId.stock} left</p>
                        )}
                      </div>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQtyChange(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 rounded-lg text-cream-dim flex items-center justify-center transition-colors hover:text-cream disabled:opacity-30"
                          style={{ background: 'rgba(28,17,10,0.07)' }}>−</button>
                        <span className="w-8 text-center text-cream font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item, item.quantity + 1)}
                          disabled={atMax}
                          title={atMax ? `Max ${item.productId.stock} in stock` : ''}
                          className="w-7 h-7 rounded-lg text-cream-dim flex items-center justify-center transition-colors hover:text-cream disabled:opacity-30"
                          style={{ background: 'rgba(28,17,10,0.07)' }}>+</button>
                      </div>

                      {/* Line total */}
                      <p className="font-bold text-cream w-16 text-right">${(item.productId.price * item.quantity).toFixed(2)}</p>

                      {/* Remove */}
                      <button onClick={() => handleRemove(item._id)} className="text-cream-muted hover:text-fire-400 transition-colors ml-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order summary */}
            <div className="rounded-2xl p-6 h-fit" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
              <h2 className="text-lg font-bold text-cream font-display mb-4">Order Summary</h2>

              {/* Selected items breakdown */}
              <div className="space-y-2 mb-3 min-h-[2rem]">
                {selectedItems.length === 0 ? (
                  <p className="text-xs text-cream-muted italic">No items selected</p>
                ) : selectedItems.map(item => (
                  <div key={item._id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-cream-dim truncate">{item.productId.name} × {item.quantity}</span>
                    <span className="text-xs font-bold text-cream flex-shrink-0">${(item.productId.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Selection counter badge */}
              <div className="flex items-center justify-between mb-1 text-xs" style={{ color: '#9B7260' }}>
                <span>{selected.size} of {items.length} item{items.length !== 1 ? 's' : ''} selected</span>
                {!allSelected && !noneSelected && (
                  <button onClick={toggleAll} className="underline hover:text-cream transition-colors">Select all</button>
                )}
              </div>

              <div className="my-4" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }} />

              <div className="flex items-center justify-between mb-6">
                <span className="text-cream font-bold">Total</span>
                <span className="text-2xl font-bold text-fire-400">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={noneSelected}
                className="w-full py-3 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: noneSelected ? 'rgba(28,17,10,0.12)' : 'linear-gradient(135deg, #9A2B0D, #C23610)', color: noneSelected ? '#9B7260' : 'white' }}>
                {noneSelected
                  ? 'Select items to checkout'
                  : `Checkout (${selected.size} item${selected.size !== 1 ? 's' : ''}) — $${total.toFixed(2)}`
                }
              </button>
              <Link to="/store" className="block mt-3 text-center text-sm text-cream-muted hover:text-cream transition-colors">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
