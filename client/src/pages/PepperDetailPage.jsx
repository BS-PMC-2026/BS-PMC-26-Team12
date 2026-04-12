import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPepper } from '../api/peppers';

const HEAT_CONFIG = {
  'None':     { label: 'None',     bg: 'bg-gray-100',  text: 'text-gray-500',   level: 0, scoville: '0 SHU',           color: '#9ca3af' },
  'Mild':     { label: 'Mild',     bg: 'bg-green-50',  text: 'text-green-700',  level: 1, scoville: '100 – 2,500 SHU', color: '#16a34a' },
  'Medium':   { label: 'Medium',   bg: 'bg-yellow-50', text: 'text-yellow-700', level: 2, scoville: '2,500 – 30K SHU', color: '#ca8a04' },
  'Hot':      { label: 'Hot',      bg: 'bg-orange-50', text: 'text-orange-700', level: 3, scoville: '30K – 100K SHU',  color: '#ea580c' },
  'Very Hot': { label: 'Very Hot', bg: 'bg-red-50',    text: 'text-red-700',    level: 4, scoville: '100K – 350K SHU', color: '#dc2626' },
  'Extreme':  { label: 'Extreme',  bg: 'bg-gray-900',  text: 'text-red-400',    level: 5, scoville: '350K+ SHU',       color: '#7f1d1d' },
};

const HeatMeter = ({ level, color }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-sm transition-all"
          style={{
            background: i < level ? color : '#f3f4f6',
            boxShadow: i < level ? `0 2px 8px ${color}55` : 'none',
            transform: i < level ? 'scale(1.05)' : 'scale(1)',
          }}>
          <span style={{ filter: i < level ? 'none' : 'grayscale(100%) opacity(0.3)' }}>🌶️</span>
        </div>
      ))}
    </div>
    <span className="text-xs text-gray-400 ml-1">{level}/5</span>
  </div>
);

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function PepperDetailPage() {
  const { id } = useParams();
  const [pepper, setPepper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPepper(id)
      .then(({ data }) => setPepper(data))
      .catch(() => setError('Pepper not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [id]);

  const heat = pepper ? (HEAT_CONFIG[pepper.heatLevel] || HEAT_CONFIG['Medium']) : null;

  return (
    <div className="min-h-screen bg-[#faf7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .detail-anim { animation: fadeUp 0.5s ease both; }
        .detail-anim-d1 { animation: fadeUp 0.5s 0.1s ease both; }
        .detail-anim-d2 { animation: fadeUp 0.5s 0.2s ease both; }
      `}</style>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-10">
        {/* Back link */}
        <Link to="/peppers"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pepper-600 transition-colors mb-8 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Peppers
        </Link>

        {loading && (
          <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"/>
              <div className="h-4 bg-gray-100 rounded w-full"/>
              <div className="h-4 bg-gray-100 rounded w-5/6"/>
              <div className="h-4 bg-gray-100 rounded w-4/5"/>
            </div>
            <div className="h-72 bg-gray-200 rounded-2xl"/>
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🌶️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link to="/peppers" className="btn-primary text-sm px-5 py-2.5">← Back to Peppers</Link>
          </div>
        )}

        {!loading && pepper && (
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left — Details */}
            <div>
              <div className="detail-anim flex flex-wrap items-center gap-3 mb-5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${heat.bg} ${heat.text}`}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: heat.color }}/>
                  {heat.label} Heat
                </span>
                {pepper.color && (
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600">
                    🎨 {pepper.color}
                  </span>
                )}
              </div>

              <h1 className="detail-anim-d1 text-5xl font-bold text-gray-900 mb-5 leading-tight"
                style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
                {pepper.name}
              </h1>

              <p className="detail-anim-d2 text-gray-600 leading-relaxed text-base mb-8"
                style={{ fontWeight: 300 }}>
                {pepper.description}
              </p>

              {/* Info grid */}
              <div className="detail-anim grid grid-cols-2 gap-4 mb-8">
                {pepper.origin && (
                  <div className="card rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Origin</p>
                    <p className="font-semibold text-gray-800 text-sm">{pepper.origin}</p>
                  </div>
                )}
                <div className="card rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Scoville Range</p>
                  <p className="font-semibold text-gray-800 text-sm">{heat.scoville}</p>
                </div>
                {pepper.color && (
                  <div className="card rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Color</p>
                    <p className="font-semibold text-gray-800 text-sm">{pepper.color}</p>
                  </div>
                )}
                <div className="card rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Added</p>
                  <p className="font-semibold text-gray-800 text-sm">{fmt(pepper.createdAt)}</p>
                </div>
              </div>

              {/* Heat Meter */}
              <div className="card rounded-xl p-5 mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Heat Level</p>
                <HeatMeter level={heat.level} color={heat.color} />
                <p className="text-xs text-gray-400 mt-2.5">{heat.scoville} on the Scoville scale</p>
              </div>

              {/* Added by */}
              {pepper.createdBy && (
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  Added by <strong className="text-gray-600">{pepper.createdBy.fullName}</strong>
                </p>
              )}
            </div>

            {/* Right — Visual */}
            <div className="detail-anim-d1">
              {pepper.imageUrl ? (
                <img src={pepper.imageUrl} alt={pepper.name}
                  className="w-full rounded-2xl object-cover shadow-xl"
                  style={{ maxHeight: 420 }}
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}

              {/* Placeholder shown if no image or image fails */}
              <div className={`rounded-2xl overflow-hidden ${pepper.imageUrl ? 'hidden' : 'flex'} items-center justify-center`}
                style={{
                  background: `linear-gradient(145deg, ${heat.color}22, ${heat.color}08)`,
                  border: `1px solid ${heat.color}33`,
                  minHeight: 340,
                  display: pepper.imageUrl ? 'none' : 'flex',
                }}>
                <div className="text-center">
                  <div className="text-[120px] leading-none mb-4 select-none"
                    style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.1))' }}>
                    🌶️
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{pepper.name}</p>
                  <p className="text-gray-300 text-xs mt-1">{heat.label} Heat</p>
                </div>
              </div>

              {/* Decorative strip below visual */}
              <div className="mt-4 rounded-xl overflow-hidden"
                style={{ background: 'linear-gradient(to right, #1a0a00, #3d1008, #1e2d12)', padding: '14px 20px' }}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-orange-300/60 mb-1">Heat Classification</p>
                <div className="flex items-center justify-between">
                  {['None','Mild','Medium','Hot','Very Hot','Extreme'].map((h) => {
                    const c = HEAT_CONFIG[h];
                    const active = h === pepper.heatLevel;
                    return (
                      <div key={h} className="flex flex-col items-center gap-1">
                        <div className="w-2 h-2 rounded-full transition-all"
                          style={{ background: active ? c.color : '#ffffff22', transform: active ? 'scale(1.5)' : 'scale(1)' }} />
                        <span className="text-[9px] font-semibold"
                          style={{ color: active ? '#fff' : '#ffffff33' }}>
                          {h.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
