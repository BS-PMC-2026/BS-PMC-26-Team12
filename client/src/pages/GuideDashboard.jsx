import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-cream font-display">{value}</p>
        <p className="text-xs text-cream-muted font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function GuideDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="relative overflow-hidden py-16 px-6 lg:px-12">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(82,171,51,0.08), transparent)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Guide Portal
          </div>
          <h1 className="text-4xl font-bold text-cream mb-1.5 font-display tracking-tight">
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-cream-dim text-sm">Your guide dashboard with pepper catalog access and account overview.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6 pb-20 space-y-6">

        <div className="grid sm:grid-cols-3 gap-4" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <StatCard icon="🌶️" label="Catalog Access" value="50+" accent="#E84420" />
          <StatCard icon="🌱" label="Your Status" value="Active" accent="#52AB33" />
          <StatCard icon="📖" label="Guide Role" value="Approved" accent="#D4A053" />
        </div>

        <div className="glass-card overflow-hidden" style={{ animation: 'slideUp 0.4s 0.08s ease-out both' }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #2D6A1A, #52AB33, #7DC066)' }} />
          <div className="p-6">
            <div className="flex flex-wrap items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 4px 20px rgba(82,171,51,0.2)' }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h2 className="font-bold text-cream text-xl font-display tracking-tight">{user?.fullName}</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.1)', border: '1px solid rgba(82,171,51,0.2)' }}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#52AB33' }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#52AB33' }} />
                    </span>
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-2 text-cream-muted text-sm mt-1">
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              {[
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Role', value: 'Farm Guide' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Status', value: 'Active' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, label: 'Access', value: 'Catalog + Profile' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: 'rgba(240,228,216,0.35)', background: 'rgba(255,255,255,0.04)' }}>{icon}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream-muted">{label}</p>
                    <p className="text-sm font-bold text-cream">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.4s 0.16s ease-out both' }}>
          <Link to="/peppers" className="group glass-card overflow-hidden hover:scale-[1.02] transition-all">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #C23610, #E84420)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.12)' }}>🌶️</div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1 group-hover:text-fire-400 transition-colors">Browse Pepper Catalog</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">Search and explore 50+ pepper varieties — heat levels, origins, and more.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#E84420' }}>
                  Open catalog
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </Link>

          <Link to="/" className="glass-card overflow-hidden hover:scale-[1.02] transition-all">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #D4A053, #E88C20)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.12)' }}>🏠</div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1">View Main Experience</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">Open the home page and review the full visitor journey design.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#D4A053' }}>
                  Open home
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </Link>

          <div className="glass-card overflow-hidden opacity-45 cursor-not-allowed">
            <div className="h-[2px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>🗓️</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-cream-dim">Tour Schedule</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,228,216,0.3)' }}>Coming Soon</span>
                </div>
                <p className="text-cream-muted text-sm leading-relaxed">View and manage your assigned tours. Available in the next release.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 flex gap-4 items-start" style={{ animation: 'slideUp 0.4s 0.24s ease-out both', background: 'rgba(82,171,51,0.04)', border: '1px solid rgba(82,171,51,0.10)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'rgba(82,171,51,0.1)' }}>
            <svg className="w-5 h-5" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-0.5" style={{ color: '#7DC066' }}>Your account is fully set up</h4>
            <p className="text-sm leading-relaxed text-cream-dim">As an approved guide you have full access to the pepper catalog. Tour management is planned for the next scope.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
