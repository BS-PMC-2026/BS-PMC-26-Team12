import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPepper } from '../api/peppers';

const H = {
  'None':     { label: 'None',     lv: 0, shu: '0 SHU',           c: '#8B7355', gradient: 'linear-gradient(135deg, #8B7355, #6B5545)' },
  'Mild':     { label: 'Mild',     lv: 1, shu: '100 – 2,500 SHU', c: '#52AB33', gradient: 'linear-gradient(135deg, #2D6A1A, #52AB33)' },
  'Medium':   { label: 'Medium',   lv: 2, shu: '2,500 – 30K SHU', c: '#D4A053', gradient: 'linear-gradient(135deg, #A87830, #D4A053)' },
  'Hot':      { label: 'Hot',      lv: 3, shu: '30K – 100K SHU',  c: '#E88C20', gradient: 'linear-gradient(135deg, #C27410, #E88C20)' },
  'Very Hot': { label: 'Very Hot', lv: 4, shu: '100K – 350K SHU', c: '#E84420', gradient: 'linear-gradient(135deg, #C23610, #E84420)' },
  'Extreme':  { label: 'Extreme',  lv: 5, shu: '350K+ SHU',       c: '#9A2B0D', gradient: 'linear-gradient(135deg, #72200A, #9A2B0D)' },
};

const heatDescriptions = {
  'None':     'No heat at all — purely about flavor.',
  'Mild':     'A gentle warmth that most people enjoy.',
  'Medium':   'A noticeable kick with balanced heat.',
  'Hot':      'Significant heat — for experienced spice lovers.',
  'Very Hot': 'Intense burn — proceed with caution.',
  'Extreme':  'Dangerously hot — for the fearless only.',
};

const fmt = d => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

function HeatMeter({ lv, c }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="h-full rounded-full transition-all duration-700" style={{
                width: i < lv ? '100%' : '0%',
                background: c,
                boxShadow: i < lv ? `0 0 8px ${c}60` : 'none',
                transitionDelay: `${i * 100}ms`,
              }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color: i < lv ? c : 'rgba(240,228,216,0.15)' }}>{i + 1}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream-muted font-bold">Mild</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream-muted font-bold">Extreme</span>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="glass-card p-5 group hover:scale-[1.02] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.04)' }}>{icon}</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted">{label}</p>
      </div>
      <p className="font-bold text-cream text-lg font-display">{value}</p>
    </div>
  );
}

export default function PepperDetailPage() {
  const { id } = useParams();
  const [pepper, setPepper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPepper(id).then(({ data }) => setPepper(data)).catch(() => setError('Pepper not found.')).finally(() => setLoading(false));
  }, [id]);

  const h = pepper ? (H[pepper.heatLevel] || H['Medium']) : null;
  const shuLabel = pepper?.scoville?.trim() ? pepper.scoville : h?.shu;

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">
        <Link to="/peppers" className="inline-flex items-center gap-2 text-sm font-medium text-cream-muted hover:text-fire-400 transition-colors mb-10 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Back to Catalog
        </Link>

        {loading && (
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="space-y-6">
              <div className="h-10 rounded-xl w-3/4" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="h-4 rounded w-full" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="h-4 rounded w-5/6" style={{ background: 'rgba(255,255,255,0.03)' }} />
              <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />)}</div>
            </div>
            <div className="h-96 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        )}

        {error && (
          <div className="text-center py-28">
            <div className="w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center text-5xl" style={{ background: 'rgba(232,68,32,0.06)' }}>🌶️</div>
            <h2 className="text-2xl font-bold text-cream mb-2 font-display">Not Found</h2>
            <p className="text-cream-dim mb-6">{error}</p>
            <Link to="/peppers" className="btn-fire text-sm px-6 py-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Catalog
            </Link>
          </div>
        )}

        {!loading && pepper && (
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3" style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div className="flex flex-wrap items-center gap-2.5 mb-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-bold text-white" style={{ background: h.gradient, boxShadow: `0 2px 12px ${h.c}30` }}>
                  <span className="text-xs">🌶️</span> {h.label} Heat
                </span>
                {pepper.color && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium" style={{ color: 'rgba(240,228,216,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    🎨 {pepper.color}
                  </span>
                )}
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-cream mb-5 leading-[1.1] tracking-tight font-display">{pepper.name}</h1>
              <p className="text-cream-dim leading-relaxed text-lg mb-10">{pepper.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {pepper.origin && <InfoCard icon="🌍" label="Origin" value={pepper.origin} />}
                <InfoCard icon="🔥" label="Scoville" value={shuLabel} />
                {pepper.color && <InfoCard icon="🎨" label="Color" value={pepper.color} />}
                <InfoCard icon="📅" label="Added" value={fmt(pepper.createdAt)} />
              </div>

              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted mb-1">Heat Rating</p>
                    <p className="text-sm text-cream-dim">{heatDescriptions[pepper.heatLevel] || ''}</p>
                  </div>
                  <span className="text-2xl font-bold text-cream font-display">{h.lv}/5</span>
                </div>
                <HeatMeter lv={h.lv} c={h.c} />
              </div>

              {pepper.createdBy && (
                <div className="flex items-center gap-3 mt-6">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                    {pepper.createdBy.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-cream-muted">Added by</p>
                    <p className="text-sm font-bold text-cream-dim">{pepper.createdBy.fullName}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 lg:sticky lg:top-24" style={{ animation: 'slideUp 0.5s 0.15s ease-out both' }}>
              <div className="rounded-2xl overflow-hidden mb-3" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.18)' }}>
                {pepper.imageUrl ? (
                  <img src={pepper.imageUrl} alt={pepper.name} className="w-full object-contain" style={{ maxHeight: 500 }}
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                ) : null}
                <div className={`items-center justify-center ${pepper.imageUrl ? 'hidden' : 'flex'}`}
                  style={{ background: `radial-gradient(ellipse at center, ${h.c}08, transparent), rgba(255,255,255,0.015)`, minHeight: 380, display: pepper.imageUrl ? 'none' : 'flex' }}>
                  <div className="text-center py-12">
                    <div className="text-[100px] leading-none mb-4 select-none animate-float">🌶️</div>
                    <p className="text-cream-dim text-base font-bold font-display">{pepper.name}</p>
                    <p className="text-cream-muted text-xs mt-1">{h.label} Heat</p>
                  </div>
                </div>
              </div>
              {pepper.imageUrl && (
                <a href={pepper.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold mb-5 px-3 py-2 rounded-lg"
                  style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.15)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h4m0 0v4m0-4L10 14M7 7h3m-3 0v3m0-3l4 4m6 6h-3m3 0v-3m0 3l-4-4M7 17h4m-4 0v-4m0 4l4-4" /></svg>
                  Open full image
                </a>
              )}

              <div className="rounded-2xl p-5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${h.c}06, rgba(212,160,83,0.03))`, border: `1px solid ${h.c}12` }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted mb-4">Heat Classification</p>
                <div className="flex items-center justify-between gap-1">
                  {Object.entries(H).map(([k, v]) => {
                    const active = k === pepper.heatLevel;
                    return (
                      <div key={k} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full h-1.5 rounded-full transition-all" style={{
                          background: active ? v.gradient : 'rgba(255,255,255,0.04)',
                          boxShadow: active ? `0 0 12px ${v.c}50` : 'none',
                        }} />
                        <span className="text-[8px] font-bold transition-colors" style={{ color: active ? '#F0E4D8' : 'rgba(240,228,216,0.15)' }}>
                          {k === 'Very Hot' ? 'V.Hot' : k}
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
