import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProduct } from '../api/products';
import { addToCart } from '../api/cart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await getProduct(id); setProduct(data); }
      catch { setError('Product not found.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true); setCartError('');
    try {
      await addToCart({ productId: id, quantity: 1 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setCartError(err.response?.data?.message || 'Failed to add to cart.');
    } finally { setAdding(false); }
  };

  if (loading) return <div className="min-h-screen bg-dark-300 flex items-center justify-center"><div className="text-cream-muted">Loading…</div></div>;
  if (error || !product) return (
    <div className="min-h-screen bg-dark-300"><Navbar />
      <div className="text-center py-24"><p className="text-cream-muted mb-4">{error || 'Product not found'}</p><Link to="/store" className="text-fire-400">← Back to Store</Link></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <Link to="/store" className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream mb-10 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back to Store
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="rounded-2xl overflow-hidden aspect-square" style={{ background: 'rgba(28,17,10,0.03)', border: '1px solid rgba(28,17,10,0.08)' }}>
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20" style={{ color: 'rgba(212,160,83,0.2)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-cream font-display mb-4">{product.name}</h1>
            <p className="text-cream-dim leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-bold text-fire-400">${product.price.toFixed(2)}</span>
              <span className="text-sm text-cream-muted pb-2">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>

            {cartError && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{cartError}</div>}

            <button onClick={handleAddToCart} disabled={adding || product.stock === 0}
              className="w-full py-4 text-base font-bold rounded-xl text-white transition-all disabled:opacity-40"
              style={{ background: added ? 'linear-gradient(135deg, #2D6A1A, #52AB33)' : 'linear-gradient(135deg, #9A2B0D, #C23610)' }}>
              {added ? '✓ Added to Cart' : adding ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link to="/cart" className="mt-3 text-center text-sm text-cream-muted hover:text-cream transition-colors">View Cart →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
