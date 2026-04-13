import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginVisitor } from '../api/auth';

const Spin = () => <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>;

export default function VisitorLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => { const e = {}; if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'; if (!form.password) e.password = 'Password is required'; return e; };
  const handleSubmit = async e => {
    e.preventDefault(); const errs = validate(); if (Object.keys(errs).length) return setErrors(errs); setErrors({}); setServerError(''); setLoading(true);
    try { const { data } = await loginVisitor(form); login(data.token, data.user); navigate('/peppers'); } catch (err) { setServerError(err.response?.data?.message || 'Login failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-dark-300">
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1C1614 0%, #2A1A14 40%, #1C1614 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,68,32,0.12), transparent 70%)' }} />
        <div className="absolute top-16 right-6 text-[140px] opacity-[0.07] rotate-[-10deg] animate-float select-none">🌶️</div>
        <div className="absolute bottom-24 left-8 text-[80px] opacity-[0.05] rotate-[10deg] animate-float-slow select-none">🔥</div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 px-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)', boxShadow: '0 0 40px rgba(232,68,32,0.2)' }}>🌶️</div>
          <h2 className="text-3xl font-bold text-cream mb-4 font-display tracking-tight">Welcome Back</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-10">Sign in to browse our pepper catalog and book your next farm tour.</p>

          <div className="glass-card p-5 text-left mb-8" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted mb-3">What you get</p>
            {[
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, text: '50+ Pepper Varieties' },
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>, text: '4.9 Star Rating' },
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Free Guided Tours' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)' }}>{icon}</div>
                <span className="text-sm text-cream-dim">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-fire-400 font-bold text-lg mb-8 lg:hidden">🌶️ Pepper Farm</Link>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #9A2B0D, #C23610, #D4A053)' }} />
            <div className="p-7">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-cream mb-2 font-display tracking-tight">Sign In</h1>
                <p className="text-cream-dim text-sm">Enter your credentials to access the pepper catalog.</p>
              </div>

              {serverError && (
                <div className="mb-5 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.15)', color: '#FF8866' }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-dark flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email Address
              </label>
              <input className={`input-dark ${errors.email ? '!border-fire-500/50' : ''}`} type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1.5 text-xs text-fire-400 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>{errors.email}</p>}
            </div>
            <div>
              <label className="label-dark flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Password
              </label>
              <input className={`input-dark ${errors.password ? '!border-fire-500/50' : ''}`} type="password" placeholder="Your password" value={form.password} onChange={set('password')} />
              {errors.password && <p className="mt-1.5 text-xs text-fire-400 flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>{errors.password}</p>}
            </div>
                <button type="submit" disabled={loading} className="btn-fire w-full py-3.5 text-sm rounded-xl flex items-center justify-center gap-2">
                  {loading ? <><Spin /> Signing in...</> : <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                    Sign In
                  </>}
                </button>
              </form>

              <div className="mt-8 pt-6 space-y-3 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-cream-muted">Don't have an account? <Link to="/register" className="text-fire-400 font-semibold hover:text-fire-300 transition-colors">Register</Link></p>
                <p><Link to="/guide/login" className="text-cream-muted font-medium hover:text-cream-dim transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  Login as Guide
                </Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
