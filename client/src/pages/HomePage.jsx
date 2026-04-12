import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🌱',
    title: 'Expert Guides',
    desc: 'Learn from certified pepper specialists with decades of growing experience.',
  },
  {
    icon: '🌶️',
    title: 'Rare Varieties',
    desc: 'Explore 50+ pepper varieties from mild sweet bells to the world\'s hottest cultivars.',
  },
  {
    icon: '📖',
    title: 'Rich Catalog',
    desc: 'Browse our growing catalog of 50+ pepper varieties with heat levels, origins, and full descriptions.',
  },
];

const steps = [
  { num: '01', title: 'Create an Account', desc: 'Register as a visitor in under a minute.' },
  { num: '02', title: 'Search Peppers', desc: 'Browse our catalog and search by name.' },
  { num: '03', title: 'Discover & Learn', desc: 'View full details, heat levels, and origins.' },
];

export default function HomePage() {
  const { user } = useAuth();
  const isVisitorOrGuide = user && (user.role === 'visitor' || user.role === 'guide');
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#faf7f4]" style={{ fontFamily: "'Lora', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes floatBlob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-18px) rotate(6deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        .anim-fade-up        { animation: fadeUp 0.7s ease forwards; }
        .anim-fade-up-d1     { animation: fadeUp 0.7s 0.15s ease both; }
        .anim-fade-up-d2     { animation: fadeUp 0.7s 0.30s ease both; }
        .anim-fade-up-d3     { animation: fadeUp 0.7s 0.45s ease both; }
        .anim-scale-in       { animation: scaleIn 0.6s 0.55s ease both; }

        .blob { animation: floatBlob 8s ease-in-out infinite; }
        .blob2 { animation: floatBlob 11s 2s ease-in-out infinite reverse; }

        .hero-bg {
          background: linear-gradient(135deg,
            #1a0a00 0%,
            #3d1008 25%,
            #6b2210 45%,
            #8b3a1a 60%,
            #5a3a1a 80%,
            #1e2d12 100%
          );
        }

        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 1px;
          background: linear-gradient(to right, #c1440e, transparent);
        }
      `}</style>

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero-bg relative overflow-hidden min-h-[92vh] flex items-center">

        {/* Decorative blobs */}
        <div className="blob absolute top-16 right-12 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #ff6b35 0%, transparent 70%)' }} />
        <div className="blob2 absolute bottom-8 left-8 w-56 h-56 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7fb069 0%, transparent 70%)' }} />
        <div className="blob absolute top-1/2 right-1/3 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e84316 0%, transparent 60%)' }} />

        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

        {/* Big decorative pepper shapes */}
        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="relative w-full h-full">
            <span className="absolute top-1/4 right-16 text-[220px] opacity-10 blob"
              style={{ filter: 'blur(1px)', transform: 'rotate(-20deg)' }}>🌶️</span>
            <span className="absolute bottom-1/4 right-40 text-[120px] opacity-8 blob2"
              style={{ filter: 'blur(0.5px)', transform: 'rotate(15deg)' }}>🫑</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-28">
          <div className="max-w-2xl">

            <div className="anim-fade-up inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-orange-400/30 bg-orange-400/10 text-orange-300 text-sm font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
              Tours Now Open for Booking
            </div>

            <h1 className="anim-fade-up-d1 text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              style={{ letterSpacing: '-0.02em' }}>
              Experience the{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ff6b35, #ff9a3c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Heat
              </span>
              {' '}of Our Pepper Farm
            </h1>

            <p className="anim-fade-up-d2 text-lg text-orange-100/80 leading-relaxed mb-10 max-w-xl"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              Book guided tours through lush pepper fields, meet expert growers, and
              discover the world of peppers — from sweet to scorching.
            </p>

            <div className="anim-fade-up-d3 flex flex-wrap gap-4">
              {/* Primary CTA — changes based on auth state */}
              <Link
                to={isAdmin ? '/admin' : '/peppers'}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-100"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'linear-gradient(135deg, #c1440e, #e85d2c)',
                  boxShadow: '0 4px 24px rgba(193,68,14,0.45)',
                }}
              >
                {isAdmin ? 'Go to Dashboard' : 'Explore Peppers'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Secondary CTA — only show Guide Portal if not logged in */}
              {!user && (
                <Link
                  to="/guide/login"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-100"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#e8d5b0',
                    border: '1px solid rgba(232,213,176,0.3)',
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Guide Portal
                </Link>
              )}
            </div>

            {/* Stats strip */}
            <div className="anim-scale-in flex gap-8 mt-16 pt-8 border-t border-white/10">
              {[['50+', 'Pepper Varieties'], ['200+', 'Tours Completed'], ['4.9★', 'Guest Rating']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-white">{val}</div>
                  <div className="text-xs text-orange-200/60 mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.04em' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16">
            <path d="M0 80V40C360 0 720 80 1080 40C1260 20 1380 40 1440 40V80H0Z" fill="#faf7f4" />
          </svg>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-pepper-600 text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Why Visit Us
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              A Unique Farm Experience
            </h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-pepper-500" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card card p-8 rounded-2xl border border-orange-100 bg-white">
                <div className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, #fff1ec, #ffe5d5)' }}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 leading-relaxed text-[15px]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: 'linear-gradient(180deg, #faf7f4 0%, #fff5f0 100%)' }}>
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <p className="text-pepper-600 text-sm font-semibold uppercase tracking-widest mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Simple Process
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
              How It Works
            </h2>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-pepper-500" />
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-1/2 w-full h-px"
                    style={{ background: 'linear-gradient(to right, #c1440e40, transparent)' }} />
                )}
                <div className="relative z-10 mx-auto w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg text-white mb-5 transition-transform group-hover:scale-110 duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #c1440e, #e85d2c)',
                    boxShadow: '0 8px 24px rgba(193,68,14,0.3)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                  {num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              to={isAdmin ? '/admin' : '/peppers'}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-200 hover:scale-105 active:scale-100"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'linear-gradient(135deg, #c1440e, #e85d2c)',
                boxShadow: '0 6px 28px rgba(193,68,14,0.35)',
              }}
            >
              {isAdmin ? 'Open Admin Panel' : 'Browse the Catalog →'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-orange-100 py-8 px-6"
        style={{ background: '#faf7f4' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌶️</span>
            <span className="font-bold text-pepper-700">Pepper Farm</span>
          </div>
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2026 The Dinars Pepper Farm. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {!user && (
              <>
                <Link to="/guide/register" className="hover:text-pepper-600 transition-colors">Become a Guide</Link>
                <Link to="/admin/login" className="hover:text-pepper-600 transition-colors">Admin</Link>
              </>
            )}
            {isVisitorOrGuide && (
              <Link to="/peppers" className="hover:text-pepper-600 transition-colors">Browse Peppers</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-pepper-600 transition-colors">Admin Panel</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
