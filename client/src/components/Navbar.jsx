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
  ],
  guide: [
    { label: 'Peppers', to: '/peppers' },
    { label: 'My Profile', to: '/guide' },
  ],
  admin: [
    { label: 'Admin Panel', to: '/admin' },
  ],
};

const RolePill = ({ role }) => {
  const styles = {
    visitor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    guide:   'bg-amber-50 text-amber-700 border-amber-200',
    admin:   'bg-pepper-50 text-pepper-700 border-pepper-200',
  };
  return (
    <span className={`text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${styles[role] || ''}`}>
      {role}
    </span>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      <nav className={`fixed top-0 inset-x-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <span className="text-2xl leading-none select-none group-hover:rotate-12 transition-transform duration-300 inline-block">🌶️</span>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] text-gray-400 font-medium tracking-widest uppercase hidden sm:block">Hadinarim</span>
                <span className="text-[15px] font-bold text-pepper-700 tracking-tight" style={{ fontFamily: "'Lora', Georgia, serif" }}>Pepper Farm</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) =>
                link.highlight ? (
                  <Link key={link.to} to={link.to} className="ml-2 btn-primary text-sm py-2 px-4">{link.label}</Link>
                ) : (
                  <Link key={link.to} to={link.to}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive(link.to) ? 'text-pepper-600 bg-pepper-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}>
                    {link.label}
                    {isActive(link.to) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pepper-500 rounded-full"/>
                    )}
                  </Link>
                )
              )}

              {user && (
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                  <div className="hidden lg:flex flex-col items-end leading-tight">
                    <span className="text-[13px] font-semibold text-gray-800">{user.fullName}</span>
                    <RolePill role={role} />
                  </div>
                  <button onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-pepper-600 border border-pepper-300 rounded-lg hover:bg-pepper-50 hover:border-pepper-400 active:bg-pepper-100 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setOpen(p => !p)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pb-4 pt-1 space-y-1 border-t border-gray-100 bg-white">
            {user && (
              <div className="flex items-center gap-2 px-3 py-2.5 mb-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-pepper-100 flex items-center justify-center text-pepper-700 font-bold text-sm flex-shrink-0">
                  {user.fullName?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.fullName}</p>
                  <RolePill role={role} />
                </div>
              </div>
            )}
            {links.map(link => (
              <Link key={link.to} to={link.to}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-pepper-50 text-pepper-600' : 'text-gray-700 hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
            {user && (
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-pepper-600 border border-pepper-200 hover:bg-pepper-50 transition-colors mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </>
  );
}
