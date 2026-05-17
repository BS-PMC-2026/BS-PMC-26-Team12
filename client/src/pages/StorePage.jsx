import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';

function ProductCard({ product, onAddToCart }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    try {
      await onAddToCart(product._id);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <Link to={`/store/${product._id}`}>
        <div className="h-44 overflow-hidden relative" style={{ background: 'rgba(255,255,255,0.02)' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl select-none">🛒</div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(22,17,15,0.7)' }}>
              <span className="text-xs font-bold text-cream-muted uppercase tracking-wider px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link to={`/store/${product._id}`}>
          <h3 className="font-bold text-cream text-lg font-display mb-1 hover:text-fire-400 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-cream-dim text-sm line-clamp-2 mb-4" style={{ minHeight: '2.5rem' }}>{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-fire-400">${product.price.toFixed(2)}</span>
          <span className="text-xs text-cream-muted">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
        <button onClick={handleAdd} disabled={adding || product.stock === 0}
          className="mt-4 w-full py-2.5 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-40"
          style={{ background: added ? 'linear-gradient(135deg, #2D6A1A, #52AB33)' : 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
          {added ? '✓ Added to Cart' : adding ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [cartError, setCartError] = useState('');

  const load = async (params = {}) => {
    setLoading(true); setError('');
    try { const { data } = await getProducts(params); setProducts(data); }
    catch { setError('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = e => {
    e.preventDefault();
    load({ search: search.trim(), ...(inStockOnly ? { inStock: 'true' } : {}) });
  };

  const handleAddToCart = async (productId) => {
    setCartError('');
    try { await addToCart({ productId, quantity: 1 }); }
    catch (err) { setCartError(err.response?.data?.message || 'Failed to add to cart.'); }
  };

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="relative overflow-hidden py-16 text-center px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(212,160,83,0.08), transparent)' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4A053' }} /> Farm Store
          </div>
          <h1 className="text-4xl font-bold text-cream font-display mb-3">Our Products</h1>
          <p className="text-cream-dim text-base mb-8">Browse and add products to your cart.</p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <input className="input-dark flex-1 !pl-4 !py-3" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <label className="flex items-center gap-1.5 text-xs text-cream-dim cursor-pointer px-3">
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-fire-400" />
              In stock
            </label>
            <button type="submit" className="px-6 py-3 text-sm font-bold rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-20">
        {cartError && <div className="mb-6 p-3 rounded-xl text-sm text-center" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{cartError}</div>}
        {error && <p className="text-center text-cream-muted py-16">{error}</p>}
        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="h-44 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            <div className="p-5 space-y-3"><div className="h-5 rounded w-2/3 animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} /></div>
          </div>
        ))}</div>}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24"><p className="text-cream-muted">No products found.</p></div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => <ProductCard key={p._id} product={p} onAddToCart={handleAddToCart} />)}
          </div>
        )}
      </div>
    </div>
  );
}
