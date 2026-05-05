import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProducts, updateProduct, deleteProduct } from '../api/products';

function EditModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({ name: product.name, description: product.description, price: product.price, stock: product.stock, imageUrl: product.imageUrl || '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.name || !form.description || form.price === '' || form.stock === '') return setError('All fields are required.');
    if (Number(form.price) < 0 || Number(form.stock) < 0) return setError('Price and stock must be non-negative.');
    setLoading(true); setError('');
    try {
      const { data } = await updateProduct(product._id, { ...form, price: Number(form.price), stock: Number(form.stock) });
      onSave(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: '#1A1410', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h2 className="text-lg font-bold text-cream font-display mb-5">Edit Product</h2>
        {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        <div className="space-y-4">
          <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Name</label><input className="input-dark w-full" value={form.name} onChange={e => set('name', e.target.value)} /></div>
          <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Description</label><textarea className="input-dark w-full resize-none" rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Price ($)</label><input type="number" min="0" step="0.01" className="input-dark w-full" value={form.price} onChange={e => set('price', e.target.value)} /></div>
            <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Stock</label><input type="number" min="0" className="input-dark w-full" value={form.stock} onChange={e => set('stock', e.target.value)} /></div>
          </div>
          <div><label className="block text-xs font-bold text-cream-muted uppercase tracking-wider mb-1.5">Image URL</label><input className="input-dark w-full" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} /></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 text-sm font-bold rounded-xl text-white disabled:opacity-50" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>{loading ? 'Saving…' : 'Save Changes'}</button>
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold rounded-xl text-cream-dim" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try { const { data } = await getProducts(); setProducts(data); }
    catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await deleteProduct(id); setProducts(p => p.filter(x => x._id !== id)); }
    catch { setError('Failed to delete product.'); }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      {editing && <EditModal product={editing} onSave={updated => { setProducts(p => p.map(x => x._id === updated._id ? updated : x)); setEditing(null); }} onClose={() => setEditing(null)} />}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-cream font-display mb-1">Manage Products</h1>
            <p className="text-cream-muted text-sm">{products.length} product{products.length !== 1 ? 's' : ''} in store</p>
          </div>
          <Link to="/admin/products/add" className="px-5 py-2.5 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>+ Add Product</Link>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
        {loading && <div className="text-center py-16 text-cream-muted">Loading…</div>}
        {!loading && products.length === 0 && <div className="text-center py-16 text-cream-muted">No products yet. <Link to="/admin/products/add" className="text-fire-400">Add one.</Link></div>}

        {!loading && products.length > 0 && (
          <div className="space-y-3">
            {products.map(p => (
              <div key={p._id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-cream truncate">{p.name}</p>
                  <p className="text-sm text-cream-muted truncate">{p.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-fire-400">${p.price.toFixed(2)}</p>
                  <p className="text-xs text-cream-muted">{p.stock} in stock</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(p)} className="px-4 py-2 text-xs font-bold rounded-lg transition-all" style={{ background: 'rgba(212,160,83,0.1)', color: '#D4A053', border: '1px solid rgba(212,160,83,0.2)' }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="px-4 py-2 text-xs font-bold rounded-lg transition-all" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420', border: '1px solid rgba(232,68,32,0.15)' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
