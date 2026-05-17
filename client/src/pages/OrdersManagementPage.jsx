import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getOrders, updateOrderStatus } from '../api/orders';

const STATUS_COLORS = {
  pending:   { c: '#D4A053', bg: 'rgba(212,160,83,0.1)',   border: 'rgba(212,160,83,0.2)'  },
  shipped:   { c: '#52AB33', bg: 'rgba(82,171,51,0.1)',    border: 'rgba(82,171,51,0.2)'   },
  completed: { c: '#4A90D9', bg: 'rgba(74,144,217,0.1)',   border: 'rgba(74,144,217,0.2)'  },
  cancelled: { c: '#E84420', bg: 'rgba(232,68,32,0.08)',   border: 'rgba(232,68,32,0.15)'  },
};

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try { const { data } = await getOrders(); setOrders(data); }
    catch { setError('Failed to load orders.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleStatus = async (orderId, status) => {
    try {
      const { data } = await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
    } catch { setError('Failed to update status.'); }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-cream font-display mb-1">Orders Management</h1>
          <p className="text-cream-muted text-sm">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}
        {!loading && orders.length === 0 && <div className="text-center py-16 text-cream-muted">No orders yet.</div>}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map(order => {
              const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
              return (
                <div key={order._id} className="rounded-2xl p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-cream-muted mb-1">Order ID</p>
                      <p className="font-mono text-sm text-cream">{order._id}</p>
                      <p className="text-xs text-cream-muted mt-1">
                        {order.userId?.fullName || 'Unknown'} · {order.userId?.email || ''} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xl font-bold text-fire-400">${order.totalAmount?.toFixed(2)}</span>
                      <select value={order.status} onChange={e => handleStatus(order._id, e.target.value)}
                        className="text-xs font-bold rounded-lg px-3 py-1.5 cursor-pointer outline-none"
                        style={{ background: sc.bg, color: sc.c, border: `1px solid ${sc.border}` }}>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  {order.items?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {order.items.map(item => (
                        <span key={item._id} className="text-xs px-2.5 py-1 rounded-lg text-cream-dim" style={{ background: 'rgba(28,17,10,0.04)', border: '1px solid rgba(28,17,10,0.08)' }}>
                          {item.productId?.name || 'Product'} × {item.quantity}
                        </span>
                      ))}
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
