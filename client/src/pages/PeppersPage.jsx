import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPeppers } from '../api/peppers';

const HEAT_CONFIG = {
  'None':     { label: 'None',     bg: 'bg-gray-100',   text: 'text-gray-500',   dot: '#9ca3af', scoville: '0 SHU',        level: 0 },
  'Mild':     { label: 'Mild',     bg: 'bg-green-50',   text: 'text-green-700',  dot: '#16a34a', scoville: '100–2,500 SHU', level: 1 },
  'Medium':   { label: 'Medium',   bg: 'bg-yellow-50',  text: 'text-yellow-700', dot: '#ca8a04', scoville: '2,500–30K SHU', level: 2 },
  'Hot':      { label: 'Hot',      bg: 'bg-orange-50',  text: 'text-orange-700', dot: '#ea580c', scoville: '30K–100K SHU',  level: 3 },
  'Very Hot': { label: 'Very Hot', bg: 'bg-red-50',     text: 'text-red-700',    dot: '#dc2626', scoville: '100K–350K SHU', level: 4 },
  'Extreme':  { label: 'Extreme',  bg: 'bg-gray-900',   text: 'text-red-400',    dot: '#7f1d1d', scoville: '350K+ SHU',     level: 5 },
};

const HeatDots = ({ level }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-base leading-none" style={{ opacity: i < level ? 1 : 0.15 }}>🌶️</span>
    ))}
  </div>
);

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-3 w-full bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-5 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

function PepperCard({ pepper, idx }) {
  const heat = HEAT_CONFIG[pepper.heatLevel] || HEAT_CONFIG['Medium'];
  return (
    <Link
      to={`/peppers/${pepper._id}`}
      className="group block rounded-2xl bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      style={{ animation: `fadeUp 0.4s ${idx * 0.06}s ease both` }}
    >
      <div className="h-1.5 w-full" style={{
        background: heat.level === 0 ? '#e5e7eb'
          : heat.level === 1 ? 'linear-gradient(to right, #4ade80, #16a34a)'
          : heat.level === 2 ? 'linear-gradient(to right, #fde047, #ca8a04)'
          : heat.level === 3 ? 'linear-gradient(to right, #fb923c, #ea580c)'
          : heat.level === 4 ? 'linear-gradient(to right, #f87171, #dc2626)'
          : 'linear-gradient(to right, #dc2626, #450a0a)'
      }} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-pepper-600 transition-colors"
            style={{ fontFamily: "'Lora', serif" }}>
            {pepper.name}
          </h3>
          <span className={`badge flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full ${heat.bg} ${heat.text}`}>
            {heat.label}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
          {pepper.description}
        </p>

        <div className="flex items-center justify-between">
          <HeatDots level={heat.level} />
          {pepper.origin && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <circle cx="12" cy="11" r="3" strokeWidth={2}/>
              </svg>
              {pepper.origin}
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">{heat.scoville}</span>
          <span className="text-xs font-semibold text-pepper-600 group-hover:gap-2 transition-all flex items-center gap-1">
            View details
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PeppersPage() {
  const [peppers, setPeppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const fetch = async (term = '') => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getPeppers(term);
      setPeppers(data);
      setSearched(!!term);
    } catch {
      setError('Failed to load peppers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetch(query.trim());
  };

  return (
    <div className="min-h-screen bg-[#faf7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
      <Navbar />

      {/* Hero search header */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0a00 0%, #3d1008 55%, #1e2d12 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` }}/>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 text-[130px] opacity-10 select-none pointer-events-none">🌶️</div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-pepper-400 text-xs font-bold uppercase tracking-widest mb-4">Pepper Encyclopedia</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Explore Our Peppers
          </h1>
          <p className="text-orange-200/60 text-sm mb-8 font-light">
            Browse and search our curated catalog of peppers from around the world.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
            <input
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 bg-white/95 border-0 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pepper-400 shadow-lg"
              placeholder="Search by pepper name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit"
              className="px-5 py-3 rounded-xl text-sm font-bold text-white whitespace-nowrap transition-all hover:opacity-90 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #c1440e, #e85d2c)' }}>
              Search
            </button>
            {searched && (
              <button type="button" onClick={() => { setQuery(''); fetch(''); }}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:text-white transition-colors border border-white/20">
                Clear
              </button>
            )}
          </form>

          {searched && !loading && (
            <p className="mt-4 text-orange-200/50 text-sm">
              {peppers.length} result{peppers.length !== 1 ? 's' : ''} for "<em>{query}</em>"
            </p>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 32V16C480 0 960 32 1440 16V32H0Z" fill="#faf7f4"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">

        {error && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => fetch()} className="btn-primary text-sm px-5 py-2.5">Try Again</button>
          </div>
        )}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && peppers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: "'Lora', serif" }}>
              No peppers found
            </h3>
            <p className="text-gray-400 text-sm">Try a different search term.</p>
          </div>
        )}

        {!loading && !error && peppers.length > 0 && (
          <>
            {!searched && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  All Peppers — {peppers.length} varieties
                </p>
                <div className="flex gap-2 text-xs text-gray-400">
                  {['None','Mild','Medium','Hot','Very Hot','Extreme'].map(h => {
                    const c = HEAT_CONFIG[h];
                    return (
                      <span key={h} className={`px-2 py-0.5 rounded-full font-semibold ${c.bg} ${c.text}`}>{h}</span>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {peppers.map((p, i) => <PepperCard key={p._id} pepper={p} idx={i} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
