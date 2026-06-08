import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const SHOWCASE = [
  { name: 'Ghost Pepper', shu: '1,041,427', heat: 5, tag: 'Extreme', c: '#9A2B0D' },
  { name: 'Habanero', shu: '350,000', heat: 4, tag: 'Very Hot', c: '#E84420' },
  { name: 'Jalapeño', shu: '8,000', heat: 2, tag: 'Medium', c: '#D4A053' },
  { name: 'Bell Pepper', shu: '0', heat: 0, tag: 'Sweet', c: '#52AB33' },
];

const REVIEWS = [
  { name: 'Sarah K.', role: 'Food Blogger', text: 'The most incredible farm tour I\'ve ever been on. The variety of peppers was mind-blowing!', stars: 5 },
  { name: 'David M.', role: 'Chef', text: 'Educational, fun, and the guides really know their stuff. My family absolutely loved it.', stars: 5 },
  { name: 'Lina R.', role: 'Tourist', text: 'I learned more about peppers in 2 hours than I had in my entire life. Truly amazing.', stars: 5 },
];

export default function HomePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const cta = isAdmin ? '/admin' : '/peppers';
  const ctaLabel = isAdmin ? 'Admin Dashboard' : 'Explore Collection';

  return (
    <div className="min-h-screen bg-dark-300 overflow-hidden">
      <Navbar />

      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 60% 45%, rgba(194,54,16,0.10) 0%, transparent 65%)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 70%, rgba(212,160,83,0.05) 0%, transparent 55%)' }} />
          <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle, rgba(28,17,10,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-full animate-slide-up" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.15)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fire-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-fire-500" />
                </span>
                <span className="text-xs font-bold text-fire-400 tracking-wide">Tours open — 2026 season</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[0.92] tracking-tight mb-7">
                <span className="text-cream block">Discover the</span>
                <span className="block mt-2 font-display italic" style={{ background: 'linear-gradient(135deg, #FF5C33, #E84420, #D4A053)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>World of Heat</span>
                <span className="text-cream block mt-2">at Our Farm</span>
              </h1>

              <p className="text-lg leading-relaxed max-w-lg mb-9" style={{ color: '#9B7260' }}>
                From sweet bells to the world's hottest reapers — explore 50+ curated pepper varieties, led by expert guides through the fields of Hadinarim.
              </p>

              <div className="flex flex-wrap gap-4 mb-14">
                <Link to={cta} className="btn-fire px-9 py-4 text-sm rounded-full group">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  {ctaLabel}
                </Link>
                {!user && <Link to="/guide/login" className="btn-ghost px-9 py-4 text-sm rounded-full">Guide Portal</Link>}
              </div>

              <div className="flex gap-12">
                {[['50+', 'Varieties'], ['200+', 'Tours'], ['4.9', 'Rating']].map(([v, l]) => (
                  <div key={l}>
                    <div className="text-3xl font-bold font-display" style={{ color: '#D4A053' }}>{v}</div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] mt-1 text-cream-muted">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 rounded-full opacity-30 blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(232,68,32,0.15), transparent 70%)' }} />
              <div className="relative grid grid-cols-2 gap-4">
                {SHOWCASE.map((p, i) => (
                  <div key={p.name} className={`glass-card p-5 hover:scale-[1.03] cursor-default transition-all ${i % 2 === 1 ? 'mt-6' : ''}`}
                    style={{ animation: `slideUp 0.5s ${i * 0.12}s ease-out both` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${p.c}14`, border: `1px solid ${p.c}22` }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: p.c }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: p.c, background: `${p.c}12` }}>{p.tag}</span>
                    </div>
                    <h3 className="font-bold text-cream text-sm mb-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(28,17,10,0.10)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(p.heat * 20, 5)}%`, background: `linear-gradient(90deg, ${p.c}88, ${p.c})`, boxShadow: `0 0 8px ${p.c}30` }} />
                      </div>
                      <span className="text-[10px] font-bold text-cream-muted">{p.shu}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-cream-muted">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-fire-500/40 to-transparent" />
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(194,54,16,0.03), transparent)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#D4A053', background: 'rgba(212,160,83,0.06)', border: '1px solid rgba(212,160,83,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4A053' }} /> Why Visit Us
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-cream">A Farm Experience</span><br />
              <span className="font-display italic text-cream-dim">Unlike Any Other</span>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { num: '01', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'Expert Guides', desc: 'Certified specialists with decades of growing experience lead every tour through our pepper fields. Our guides know each plant by name, growing season, and Scoville profile — giving you the knowledge of an agronomist with the warmth of a friend.', accent: '#52AB33', tag: 'People' },
              { num: '02', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, title: '50+ Rare Varieties', desc: 'From Carolina Reapers to ancient heirloom cultivars — the widest pepper selection in the region. Every variety is grown, documented, and cataloged with Scoville ratings, origin stories, and flavor profiles.', accent: '#E84420', tag: 'Collection' },
              { num: '03', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, title: 'Living Encyclopedia', desc: 'Every pepper in our catalog includes Scoville rating, origin story, color profile, and expert growing tips. Search, explore, and learn at your own pace through our curated digital collection.', accent: '#D4A053', tag: 'Knowledge' },
            ].map(({ num, icon, title, desc, accent, tag }, i) => (
              <div key={title} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 lg:gap-16 py-14 ${i > 0 ? 'border-t' : ''}`}
                style={i > 0 ? { borderColor: 'rgba(28,17,10,0.07)' } : {}}>
                <div className="md:w-2/5 flex justify-center">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 text-[80px] font-bold font-display leading-none select-none" style={{ color: `${accent}08` }}>{num}</div>
                    <div className="relative w-36 h-36 rounded-3xl flex items-center justify-center" style={{ color: accent, background: `${accent}08`, border: `2px solid ${accent}18` }}>
                      {icon}
                      <span className="absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: accent, background: `${accent}12`, border: `1px solid ${accent}25` }}>{tag}</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-3/5">
                  <h3 className="text-2xl lg:text-3xl font-bold text-cream mb-4 font-display">{title}</h3>
                  <p className="text-base leading-relaxed text-cream-dim">{desc}</p>
                  <Link to={cta} className="inline-flex items-center gap-2 mt-6 text-sm font-bold transition-all hover:gap-3" style={{ color: accent }}>
                    Explore
                    <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-16" style={{ background: 'rgba(82,171,51,0.03)', borderTop: '1px solid rgba(82,171,51,0.08)', borderBottom: '1px solid rgba(82,171,51,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.06)', border: '1px solid rgba(82,171,51,0.12)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#52AB33' }} /> Simple Process
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-cream">Three Steps to</span><br />
              <span className="font-display italic" style={{ color: '#52AB33' }}>Pepper Paradise</span>
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-9 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px" style={{ background: 'linear-gradient(90deg, #52AB33, rgba(82,171,51,0.3), #52AB33)' }} />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: 1, title: 'Create Account', desc: 'Register as a visitor in under a minute — completely free.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> },
                { num: 2, title: 'Browse Catalog', desc: 'Search our encyclopedia by name, heat level, or origin.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> },
                { num: 3, title: 'Discover & Learn', desc: 'View Scoville ratings, colors, and growing regions for every variety.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
              ].map(({ num, title, desc, icon }) => (
                <div key={num} className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full flex flex-col items-center justify-center mb-6 shadow-card" style={{ background: '#FFFFFF', border: '2px solid rgba(82,171,51,0.3)' }}>
                    <span className="w-8 h-8 flex items-center justify-center rounded-full text-white" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>{icon}</span>
                    <span className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: '#3D8A24' }}>{num}</span>
                  </div>
                  <h3 className="text-base font-bold text-cream mb-2">{title}</h3>
                  <p className="text-sm text-cream-dim leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to={cta} className="btn-fire px-10 py-4 text-sm rounded-full inline-flex items-center gap-2">
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16 relative">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,160,83,0.04), transparent)' }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: '#D4A053', background: 'rgba(212,160,83,0.06)', border: '1px solid rgba(212,160,83,0.12)' }}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                Reviews
              </div>
              <h2 className="text-4xl font-bold text-cream tracking-tight">
                Loved by <span className="font-display italic" style={{ color: '#D4A053' }}>Visitors</span>
              </h2>
            </div>
            <div className="flex gap-1 pb-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <svg key={j} className="w-5 h-5" style={{ color: '#D4A053' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
              <span className="text-sm font-bold text-cream-dim ml-2">4.9 avg</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 glass-card p-10 flex flex-col justify-between" style={{ minHeight: '280px' }}>
              <div>
                <svg className="w-8 h-8 mb-6 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                <p className="text-xl leading-relaxed font-display italic text-cream-dim">{REVIEWS[0].text}</p>
              </div>
              <div className="flex items-center gap-4 mt-8 pt-6" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                  {REVIEWS[0].name[0]}
                </div>
                <div>
                  <div className="font-bold text-cream">{REVIEWS[0].name}</div>
                  <div className="text-xs text-cream-muted">{REVIEWS[0].role}</div>
                </div>
                <div className="flex gap-0.5 ml-auto">
                  {Array.from({ length: REVIEWS[0].stars }).map((_, j) => (
                    <svg key={j} className="w-4 h-4" style={{ color: '#D4A053' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-5">
              {REVIEWS.slice(1).map((r, i) => (
                <div key={i} className="glass-card p-6 flex-1">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5" style={{ color: '#D4A053' }} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed italic text-cream-dim mb-4">"{r.text}"</p>
                  <div className="flex items-center gap-2.5 pt-3" style={{ borderTop: '1px solid rgba(28,17,10,0.06)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, rgba(212,160,83,0.6), rgba(232,68,32,0.5))' }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-cream">{r.name}</div>
                      <div className="text-[11px] text-cream-muted">{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 px-6 lg:px-16 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(194,54,16,0.12), transparent)' }} />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] opacity-[0.04] select-none animate-float-slow" style={{ background: 'radial-gradient(circle, #E84420, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            <span className="text-cream">Ready to</span>{' '}
            <span className="font-display italic" style={{ color: '#E84420' }}>Explore?</span>
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto text-cream-dim leading-relaxed">
            Join hundreds of visitors who discovered the fascinating world of peppers at Hadinarim Farm.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={cta} className="btn-fire px-10 py-4 text-sm rounded-full inline-flex items-center gap-2">
              {ctaLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            {!user && <Link to="/register" className="btn-ghost px-10 py-4 text-sm rounded-full">Create Free Account</Link>}
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 lg:px-16" style={{ borderTop: '1px solid rgba(28,17,10,0.08)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </span>
            <span className="font-bold text-cream text-sm">Pepper Farm</span>
          </div>
          <p className="text-xs text-cream-muted">© 2026 Hadinarim Pepper Farm — The Dinars</p>
          <div className="flex gap-6 text-sm text-cream-muted">
            {!user && <>
              <Link to="/guide/register" className="hover:text-cream transition-colors">Become a Guide</Link>
              <Link to="/admin/login" className="hover:text-cream transition-colors">Admin</Link>
            </>}
            {user && <Link to="/peppers" className="hover:text-cream transition-colors">Peppers</Link>}
          </div>
        </div>
      </footer>
    </div>
  );
}
