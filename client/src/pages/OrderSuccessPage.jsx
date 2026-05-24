import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const STATUS = {
  pending:   { c: '#D4A053', bg: 'rgba(212,160,83,0.1)' },
  shipped:   { c: '#4A90D9', bg: 'rgba(74,144,217,0.1)' },
  completed: { c: '#52AB33', bg: 'rgba(82,171,51,0.1)' },
  cancelled: { c: '#E84420', bg: 'rgba(232,68,32,0.08)' },
};

export default function OrderSuccessPage() {
  const { state } = useLocation();
  const order = state?.order;
  const items = state?.items;

  if (!order) return (
    <div className="min-h-screen bg-dark-300"><Navbar />
      <div className="text-center py-24">
        <p className="text-cream-muted mb-4">No order information found.</p>
        <Link to="/store" className="text-fire-400">← Back to Store</Link>
      </div>
    </div>
  );

  const sc = STATUS[order.status] || STATUS.pending;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(82,171,51,0.1)' }}>
          <svg className="w-10 h-10" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-cream font-display mb-2">Order Placed!</h1>
        <p className="text-cream-muted mb-10">Your order has been successfully placed and is being processed.</p>

        <div className="rounded-2xl p-6 text-left space-y-4" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-muted uppercase tracking-wider">Order ID</span>
            <span className="font-mono text-xs text-cream">#{order._id?.slice(-8).toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-muted uppercase tracking-wider">Status</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ color: sc.c, background: sc.bg }}>{order.status}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cream-muted uppercase tracking-wider">Date</span>
            <span className="text-sm text-cream">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {items?.length > 0 && (
            <div style={{ borderTop: '1px solid rgba(28,17,10,0.08)', paddingTop: '1rem' }}>
              <p className="text-xs font-bold text-cream-muted uppercase tracking-wider mb-3">Items Ordered</p>
              <div className="space-y-2">
                {items.map(item => (
                  <div key={item._id} className="flex items-center justify-between text-sm">
                    <span className="text-cream-dim">{item.productId.name} × {item.quantity}</span>
                    <span className="font-bold text-cream">${(item.productId.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }}>
            <span className="font-bold text-cream">Total Paid</span>
            <span className="text-2xl font-bold text-fire-400">${order.totalAmount?.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Link to="/my-orders"
            className="flex-1 py-3 text-sm font-bold rounded-xl text-center transition-all hover:opacity-80"
            style={{ border: '1px solid rgba(28,17,10,0.12)', background: '#FFFFFF', color: '#5A3D2B' }}>
            My Orders
          </Link>
          <Link to="/store"
            className="flex-1 py-3 text-sm font-bold rounded-xl text-white text-center transition-all"
            style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
