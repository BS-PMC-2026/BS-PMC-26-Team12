import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/auth';

const Spin = () => <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>;

export default function AdminLogin() {
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
    try { const { data } = await loginAdmin(form); login(data.token, data.user); navigate('/admin'); } catch (err) { setServerError(err.response?.data?.message || 'Access denied.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-300">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(194,54,16,0.08), transparent)' }} />
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-10 right-[15%] text-[180px] opacity-[0.03] rotate-[-15deg] animate-float select-none">🔐</div>

      <div className="relative z-10 w-full max-w-md mx-6">
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #C23610, #E84420, #D4A053, #52AB33)' }} />
          <div className="px-8 py-10" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)', boxShadow: '0 0 30px rgba(232,68,32,0.15)' }}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#E84420' }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Restricted Area
                </div>
                <div className="text-xs text-cream-muted mt-0.5">Administrator Access Only</div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-cream mb-2 font-display tracking-tight">Admin Login</h1>
            <p className="text-cream-muted text-sm mb-8">Authorized personnel only. Please verify your credentials.</p>

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
                <input className={`input-dark ${errors.email ? '!border-fire-500/50' : ''}`} type="email" placeholder="admin@peppers.com" value={form.email} onChange={set('email')} />
                {errors.email && <p className="mt-1.5 text-xs text-fire-400">{errors.email}</p>}
              </div>
              <div>
                <label className="label-dark flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Password
                </label>
                <input className={`input-dark ${errors.password ? '!border-fire-500/50' : ''}`} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
                {errors.password && <p className="mt-1.5 text-xs text-fire-400">{errors.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-fire w-full py-3.5 text-sm rounded-xl flex items-center justify-center gap-2">
                {loading ? <><Spin /> Authenticating...</> : <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Access Admin Panel
                </>}
              </button>
            </form>

            <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <Link to="/" className="text-sm text-cream-muted hover:text-cream-dim transition-colors inline-flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Pepper Farm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
