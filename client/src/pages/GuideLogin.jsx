import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginGuide } from '../api/auth';

const Spin = () => <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>;

export default function GuideLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => { const e = {}; if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'; if (!form.password) e.password = 'Password is required'; return e; };
  const handleSubmit = async e => {
    e.preventDefault(); const errs = validate(); if (Object.keys(errs).length) return setErrors(errs); setErrors({}); setServerError(''); setIsPending(false); setLoading(true);
    try { const { data } = await loginGuide(form); login(data.token, data.user); navigate('/peppers'); } catch (err) { const msg = err.response?.data?.message || 'Login failed.'; if (msg.toLowerCase().includes('pending')) setIsPending(true); else setServerError(msg); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-dark-300">
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #111A0D, #1A2A12, #111A0D)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(82,171,51,0.10), transparent 70%)' }} />
        <div className="absolute top-16 right-6 w-40 h-40 opacity-[0.06] rotate-[-10deg] animate-float rounded-full" style={{ background: 'radial-gradient(circle, #52AB33, transparent 70%)' }} />
        <div className="absolute bottom-20 left-8 w-32 h-32 opacity-[0.04] rotate-[8deg] animate-float-slow rounded-full" style={{ background: 'radial-gradient(circle, #E84420, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 px-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 0 40px rgba(82,171,51,0.15)' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-cream mb-4 font-display tracking-tight">Guide Portal</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-10">Sign in to manage tours and access your guide dashboard.</p>

          <div className="glass-card p-5 text-left" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted mb-3">Guide benefits</p>
            {[
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, text: 'Manage Tours' },
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, text: 'Track Progress' },
              { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>, text: 'Full Catalog Access' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)' }}>{icon}</div>
                <span className="text-sm text-cream-dim">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-fire-400 font-bold text-sm mb-8 lg:hidden">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg></span>
            Pepper Farm
          </Link>

          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.015)' }}>
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #2D6A1A, #52AB33, #D4A053)' }} />
            <div className="p-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5 uppercase tracking-wider" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Guide Access
              </div>

              <h1 className="text-3xl font-bold text-cream mb-2 font-display tracking-tight">Guide Sign In</h1>
              <p className="text-cream-dim text-sm mb-8">Access your guide dashboard and tools.</p>

          {isPending && (
            <div className="mb-5 px-5 py-4 rounded-xl" style={{ background: 'rgba(212,160,83,0.06)', border: '1px solid rgba(212,160,83,0.15)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="font-bold text-sm" style={{ color: '#D4A053' }}>Account Pending Approval</p>
              </div>
              <p className="text-cream-muted text-sm pl-6">Your application is being reviewed by the admin team. You'll be notified once approved.</p>
            </div>
          )}
          {serverError && !isPending && (
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
              <input className={`input-dark ${errors.email ? '!border-fire-500/50' : ''}`} type="email" placeholder="guide@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1.5 text-xs text-fire-400">{errors.email}</p>}
            </div>
            <div>
              <label className="label-dark flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Password
              </label>
              <input className={`input-dark ${errors.password ? '!border-fire-500/50' : ''}`} type="password" placeholder="Your password" value={form.password} onChange={set('password')} />
              {errors.password && <p className="mt-1.5 text-xs text-fire-400">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 4px 20px rgba(82,171,51,0.25)' }}>
              {loading ? <><Spin /> Signing in...</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Sign In as Guide
              </>}
            </button>
          </form>

              <p className="mt-8 pt-6 text-center text-sm text-cream-muted" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                Not registered? <Link to="/guide/register" className="font-semibold hover:text-cream-dim transition-colors" style={{ color: '#52AB33' }}>Apply as guide</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
