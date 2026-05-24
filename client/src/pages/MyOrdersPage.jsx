import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getMyOrders } from '../api/orders';

const STATUS = {
  pending:   { c: '#D4A053', bg: 'rgba(212,160,83,0.1)',  border: 'rgba(212,160,83,0.2)',  label: 'Pending' },
  shipped:   { c: '#4A90D9', bg: 'rgba(74,144,217,0.1)',  border: 'rgba(74,144,217,0.2)',  label: 'Shipped' },
  completed: { c: '#52AB33', bg: 'rgba(82,171,51,0.1)',   border: 'rgba(82,171,51,0.2)',   label: 'Completed' },
  cancelled: { c: '#E84420', bg: 'rgba(232,68,32,0.08)',  border: 'rgba(232,68,32,0.15)',  label: 'Cancelled' },
};
const TABS = ['all', 'pending', 'shipped', 'completed', 'cancelled'];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try { const { data } = await getMyOrders(); setOrders(data); }
      catch { setError('Failed to load orders.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

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

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cream font-display">My Orders</h1>
          <p className="text-cream-muted text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => {
            const s = STATUS[t];
            const count = t === 'all' ? orders.length : orders.filter(o => o.status === t).length;
            const isActive = tab === t;
            return (
              <button key={t} onClick={() => setTab(t)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize"
                style={isActive
                  ? { background: t === 'all' ? 'rgba(28,17,10,0.1)' : s.bg, color: t === 'all' ? '#5A3D2B' : s.c, border: `1px solid ${t === 'all' ? 'rgba(28,17,10,0.15)' : s.border}` }
                  : { background: 'rgba(28,17,10,0.03)', color: '#9B7260', border: '1px solid rgba(28,17,10,0.08)' }
                }>
                {t === 'all' ? 'All' : s.label}
                <span className="ml-1.5 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}

        {!loading && orders.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.08)' }}>
              <svg className="w-9 h-9" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">No orders yet</h3>
            <p className="text-cream-muted text-sm mb-6">Browse our store and place your first order.</p>
            <Link to="/store" className="px-6 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>Go to Store</Link>
          </div>
        )}

        {!loading && orders.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-cream-muted">No {tab} orders.</div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(order => {
              const sc = STATUS[order.status] || STATUS.pending;
              const isOpen = expanded === order._id;
              return (
                <div key={order._id} className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setExpanded(isOpen ? null : order._id)}>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="font-mono text-xs text-cream-muted">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full capitalize" style={{ color: sc.c, background: sc.bg, border: `1px solid ${sc.border}` }}>{order.status}</span>
                      </div>
                      <p className="text-sm text-cream-dim truncate">
                        {order.items?.map(i => `${i.productId?.name || 'Product'} × ${i.quantity}`).join(', ')}
                      </p>
                      <p className="text-xs text-cream-muted mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xl font-bold text-fire-400">${order.totalAmount?.toFixed(2)}</span>
                      <svg className={`w-4 h-4 text-cream-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }}>
                      <div className="pt-4 space-y-3">
                        {order.items?.map(item => (
                          <div key={item._id} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'rgba(28,17,10,0.04)', border: '1px solid rgba(28,17,10,0.06)' }}>
                              {item.productId?.imageUrl
                                ? <img src={item.productId.imageUrl} alt={item.productId.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-4 h-4" style={{ color: 'rgba(28,17,10,0.2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                  </div>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-cream truncate">{item.productId?.name || 'Product'}</p>
                              <p className="text-xs text-cream-muted">${item.price?.toFixed(2)} each · qty {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-cream flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }}>
                          <span className="text-sm font-bold text-cream">Total</span>
                          <span className="text-base font-bold text-fire-400">${order.totalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
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
