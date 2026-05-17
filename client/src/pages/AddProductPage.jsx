import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { createProduct } from '../api/products';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || form.price === '' || form.stock === '') {
      return setError('All required fields must be filled.');
    }
    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      return setError('Price and stock must be non-negative.');
    }
    setLoading(true);
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream mb-8 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back to Products
        </Link>

        <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
          <h1 className="text-2xl font-bold text-cream font-display mb-2">Add New Product</h1>
          <p className="text-cream-muted text-sm mb-8">Fill in the details to add a product to the store.</p>

          {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420', border: '1px solid rgba(232,68,32,0.2)' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Product Name *</label>
              <input className="input-dark w-full" placeholder="e.g. Ghost Pepper Hot Sauce" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Description *</label>
              <textarea className="input-dark w-full resize-none" rows={4} placeholder="Describe the product..." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Price ($) *</label>
                <input type="number" min="0" step="0.01" className="input-dark w-full" placeholder="0.00" value={form.price} onChange={e => set('price', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Stock *</label>
                <input type="number" min="0" className="input-dark w-full" placeholder="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-2">Image URL</label>
              <input className="input-dark w-full" placeholder="https://..." value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} />
            </div>
            <div className="pt-4 flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 py-3 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
                {loading ? 'Saving…' : 'Add Product'}
              </button>
              <Link to="/admin/products" className="px-6 py-3 text-sm font-bold rounded-xl text-cream-dim transition-all text-center"
                style={{ border: '1px solid rgba(28,17,10,0.10)', background: 'transparent' }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
