import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPeppers } from '../api/peppers';

const H = {
  'None':     { label: 'None',     c: '#8B7355', lv: 0, shu: '0 SHU',           gradient: 'linear-gradient(135deg, #8B7355, #6B5545)' },
  'Mild':     { label: 'Mild',     c: '#52AB33', lv: 1, shu: '100–2,500 SHU',   gradient: 'linear-gradient(135deg, #2D6A1A, #52AB33)' },
  'Medium':   { label: 'Medium',   c: '#D4A053', lv: 2, shu: '2,500–30K SHU',   gradient: 'linear-gradient(135deg, #A87830, #D4A053)' },
  'Hot':      { label: 'Hot',      c: '#E88C20', lv: 3, shu: '30K–100K SHU',    gradient: 'linear-gradient(135deg, #C27410, #E88C20)' },
  'Very Hot': { label: 'Very Hot', c: '#E84420', lv: 4, shu: '100K–350K SHU',   gradient: 'linear-gradient(135deg, #C23610, #E84420)' },
  'Extreme':  { label: 'Extreme',  c: '#9A2B0D', lv: 5, shu: '350K+ SHU',       gradient: 'linear-gradient(135deg, #72200A, #9A2B0D)' },
};

const HeatBar = ({ lv, c }) => (
  <div className="flex gap-1 items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-1.5 rounded-full transition-all" style={{
        width: i < lv ? 16 : 10,
        background: i < lv ? c : 'rgba(28,17,10,0.10)',
        boxShadow: i < lv ? `0 0 6px ${c}40` : 'none',
      }} />
    ))}
  </div>
);

function Skel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)' }}>
      <div className="h-40 animate-pulse" style={{ background: 'rgba(28,17,10,0.04)' }} />
      <div className="p-5 space-y-3">
        <div className="h-5 rounded-lg w-2/3 animate-pulse" style={{ background: 'rgba(28,17,10,0.06)' }} />
        <div className="h-3 rounded w-full animate-pulse" style={{ background: 'rgba(28,17,10,0.04)' }} />
        <div className="h-3 rounded w-4/5 animate-pulse" style={{ background: 'rgba(28,17,10,0.04)' }} />
      </div>
    </div>
  );
}

function Card({ pepper, idx }) {
  const h = H[pepper.heatLevel] || H['Medium'];
  const shuLabel = pepper.scoville?.trim() ? pepper.scoville : h.shu;
  return (
    <Link to={`/peppers/${pepper._id}`}
      className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-lift"
      style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.08)', animation: `slideUp 0.4s ${idx * 0.06}s ease-out both` }}>

      <div className="relative h-44 overflow-hidden" style={{ background: `radial-gradient(ellipse at bottom, ${h.c}12, transparent)` }}>
        {pepper.imageUrl ? (
          <img src={pepper.imageUrl} alt={pepper.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500" style={{ background: `${h.c}12`, border: `1px solid ${h.c}18` }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: h.c }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md" style={{ color: '#fff', background: `${h.c}CC` }}>
            {h.label}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16" style={{ background: 'linear-gradient(transparent, rgba(28,17,10,0.06))' }} />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-cream text-lg leading-tight mb-2 group-hover:text-fire-400 transition-colors font-display">{pepper.name}</h3>
        <p className="text-sm leading-relaxed mb-4 line-clamp-2 text-cream-dim" style={{ minHeight: '2.5rem' }}>{pepper.description}</p>

        <div className="flex items-center justify-between mb-4">
          <HeatBar lv={h.lv} c={h.c} />
          <span className="text-[11px] text-cream-muted font-medium">{shuLabel}</span>
        </div>

        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
          {pepper.origin && <span className="text-xs text-cream-muted flex items-center gap-1.5">
            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {pepper.origin}
          </span>}
          <span className="text-xs font-bold text-fire-400/60 group-hover:text-fire-400 flex items-center gap-1.5 transition-colors ml-auto">
            Explore
            <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function PeppersPage() {
  const searchInputRef = useRef(null);
  const [peppers, setPeppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

  const load = async (term = '') => {
    setLoading(true); setError('');
    try { const { data } = await getPeppers(term); setPeppers(data); setSearched(!!term); }
    catch { setError('Failed to load peppers.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const handleSearch = e => {
    e.preventDefault();
    setActiveFilter(null);
    load(query.trim());
  };

  const filtered = activeFilter ? peppers.filter(p => p.heatLevel === activeFilter) : peppers;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="relative overflow-hidden py-20 text-center px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(194,54,16,0.12), transparent)' }} />
        <div className="absolute inset-0 opacity-[0.5] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(28,17,10,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4A053' }} />
            Pepper Encyclopedia
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-cream tracking-tight mb-3 font-display">Explore Our Peppers</h1>
          <p className="text-cream-dim text-base mb-10">Browse and search our curated catalog from around the world.</p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto relative z-20">
            <div
              className="flex-1 relative cursor-text"
              onClick={() => searchInputRef.current?.focus()}
            >
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 opacity-30 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={searchInputRef} className="input-dark !pl-11 !py-4 !bg-dark-100/95 !border-warm-100/25 !text-warm-50 placeholder:!text-warm-100/55" placeholder="Type pepper name..." value={query} onChange={e => setQuery(e.target.value)} />
            </div>
            <button
              type="submit"
              className="px-7 py-4 text-sm font-bold rounded-xl text-white transition-all hover:scale-[1.01] inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #9A2B0D, #C23610)', boxShadow: '0 4px 16px rgba(154,43,13,0.35)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </button>
            {(searched || query || activeFilter) && (
              <button type="button" onClick={() => { setQuery(''); setActiveFilter(null); load(''); }} className="btn-ghost px-5 py-4 text-sm">
                Reset
              </button>
            )}
          </form>
          {searched && !loading && <p className="mt-5 text-cream-muted text-sm">{peppers.length} result{peppers.length !== 1 ? 's' : ''} for "<em className="text-cream-dim">{query}</em>"</p>}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-20">
        {error && <div className="text-center py-16"><div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.08)' }}><svg className="w-9 h-9" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div><p className="text-cream-dim mb-4">{error}</p><button onClick={() => load()} className="btn-fire text-sm px-5 py-2.5">Try Again</button></div>}
        {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({ length: 6 }).map((_, i) => <Skel key={i} />)}</div>}
        {!loading && !error && peppers.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.06)' }}>
              <svg className="w-11 h-11" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2 font-display">No peppers found</h3>
            <p className="text-cream-muted text-sm">Try a different search term or check back later.</p>
          </div>
        )}
        {!loading && !error && peppers.length > 0 && (
          <>
            {!searched && (
              <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <p className="text-xs font-bold text-cream-muted uppercase tracking-[0.2em]">All Peppers — {filtered.length} varieties</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setActiveFilter(null)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                    style={!activeFilter ? { color: '#fff', background: 'linear-gradient(135deg, #C23610, #E84420)', boxShadow: '0 2px 10px rgba(232,68,32,0.2)' } : { color: '#9B7260', border: '1px solid rgba(28,17,10,0.10)', background: 'transparent' }}>
                    All
                  </button>
                  {Object.entries(H).map(([k, v]) => (
                    <button key={k} onClick={() => setActiveFilter(activeFilter === k ? null : k)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      style={activeFilter === k ? { color: '#fff', background: v.gradient, boxShadow: `0 2px 10px ${v.c}30` } : { color: '#9B7260', border: '1px solid rgba(28,17,10,0.10)', background: 'transparent' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: v.c }} /> {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => <Card key={p._id} pepper={p} idx={i} />)}
            </div>
            {activeFilter && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-cream-muted text-sm">No "{activeFilter}" peppers found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
