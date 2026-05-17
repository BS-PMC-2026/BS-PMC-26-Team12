import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = {
  guest: [
    { label: 'Home', to: '/' },
    { label: 'Peppers', to: '/peppers' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register', highlight: true },
  ],
  visitor: [
    { label: 'Home', to: '/' },
    { label: 'Peppers', to: '/peppers' },
    { label: 'Store', to: '/store' },
    { label: 'Cart', to: '/cart' },
    { label: 'Tours', to: '/tours' },
    { label: 'My Bookings', to: '/my-bookings' },
  ],
  guide: [
    { label: 'Peppers', to: '/peppers' },
    { label: 'My Profile', to: '/guide' },
    { label: 'My Tours', to: '/guide/tours' },
    { label: 'Create Tour', to: '/guide/tours/create' },
  ],
  admin: [
    { label: 'Admin Panel', to: '/admin' },
    { label: 'Products', to: '/admin/products' },
    { label: 'Orders', to: '/admin/orders' },
  ],
};

const RolePill = ({ role }) => {
  const m = { visitor: ['#52AB33','#F0F7EC'], guide: ['#D4A053','#FFF8F0'], admin: ['#E84420','#FFF1EC'] };
  const [c, bg] = m[role] || ['#999','#eee'];
  return <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full" style={{ color: c, background: `${c}15`, border: `1px solid ${c}25` }}>{role}</span>;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/'); };
  const role = user?.role || 'guest';
  const links = NAV_LINKS[role] || NAV_LINKS.guest;
  const isActive = (to) => location.pathname === to || (to === '/peppers' && location.pathname.startsWith('/peppers'));

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-3'
      }`} style={{
        background: scrolled ? 'rgba(22,17,15,0.92)' : 'rgba(22,17,15,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow"
                style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-[9px] font-bold tracking-[0.25em] uppercase hidden sm:block" style={{ color: 'rgba(212,160,83,0.6)' }}>Hadinarim</span>
                <span className="text-[15px] font-bold tracking-tight font-display text-cream">Pepper Farm</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((link) =>
                link.highlight ? (
                  <Link key={link.to} to={link.to} className="ml-3 btn-fire text-sm py-2 px-5">{link.label}</Link>
                ) : (
                  <Link key={link.to} to={link.to}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive(link.to)
                        ? 'text-fire-400'
                        : 'text-cream-dim hover:text-cream'
                    }`} style={isActive(link.to) ? { background: 'rgba(232,68,32,0.1)' } : {}}>
                    {link.label}
                  </Link>
                )
              )}
              {user && (
                <div className="flex items-center gap-3 ml-4 pl-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="hidden lg:flex flex-col items-end leading-tight">
                    <span className="text-[13px] font-semibold text-cream">{user.fullName}</span>
                    <RolePill role={role} />
                  </div>
                  <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setOpen(p => !p)} className="md:hidden p-2 rounded-lg transition-colors" style={{ color: 'rgba(240,228,216,0.5)' }} aria-label="Menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-5 pb-4 pt-3 space-y-1 mt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {user && (
              <div className="flex items-center gap-3 px-3 py-3 mb-3 glass-card rounded-xl">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                  {user.fullName?.[0]?.toUpperCase()}</div>
                <div><p className="text-sm font-semibold text-cream">{user.fullName}</p><RolePill role={role} /></div>
              </div>
            )}
            {links.map(link => (
              <Link key={link.to} to={link.to} className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? 'text-fire-400' : 'text-cream-dim hover:text-cream'}`}
                style={isActive(link.to) ? { background: 'rgba(232,68,32,0.1)' } : {}}>{link.label}</Link>
            ))}
            {user && (
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-cream-dim hover:text-cream transition-colors mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="h-[4.5rem]" />
    </>
  );
}
