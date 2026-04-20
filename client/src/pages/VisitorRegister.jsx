import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerVisitor } from '../api/auth';

const Spin = () => <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>;

export default function VisitorRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => { const e = {}; if (!form.fullName.trim()) e.fullName = 'Required'; if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email'; if (form.password.length < 6) e.password = 'Min 6 chars'; if (form.password !== form.confirmPassword) e.confirmPassword = 'Mismatch'; return e; };
  const handleSubmit = async e => {
    e.preventDefault(); const errs = validate(); if (Object.keys(errs).length) return setErrors(errs); setErrors({}); setServerError(''); setLoading(true);
    try { const { data } = await registerVisitor(form); login(data.token, data.user); navigate('/peppers'); } catch (err) { setServerError(err.response?.data?.message || 'Failed.'); } finally { setLoading(false); }
  };

  const steps = [
    { num: '01', label: 'Fill Details', done: !!(form.fullName && form.email) },
    { num: '02', label: 'Set Password', done: !!(form.password && form.confirmPassword && form.password === form.confirmPassword) },
    { num: '03', label: 'Get Access', done: false },
  ];

  return (
    <div className="min-h-screen flex bg-dark-300">
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1C1614, #2A1A14, #1C1614)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(232,68,32,0.12), transparent 70%)' }} />
        <div className="absolute top-20 right-8 text-[160px] opacity-[0.07] rotate-[-15deg] animate-float select-none">🌶️</div>
        <div className="absolute bottom-24 left-6 text-[90px] opacity-[0.05] rotate-[10deg] animate-float-slow select-none">🌱</div>
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 px-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center text-4xl animate-pulse-glow" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)', boxShadow: '0 0 40px rgba(232,68,32,0.2)' }}>🌶️</div>
          <h2 className="text-3xl font-bold text-cream mb-4 font-display tracking-tight">Join the Farm</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-10">Create your account and explore guided tours through world-class pepper fields.</p>

          <div className="space-y-3 text-left">
            {steps.map(({ num, label, done }) => (
              <div key={num} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all" style={{ background: done ? 'rgba(82,171,51,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${done ? 'rgba(82,171,51,0.15)' : 'rgba(255,255,255,0.04)'}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: done ? 'rgba(82,171,51,0.15)' : 'rgba(255,255,255,0.05)', color: done ? '#52AB33' : 'rgba(240,228,216,0.3)' }}>
                  {done ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> : num}
                </div>
                <span className="text-sm font-medium" style={{ color: done ? '#52AB33' : 'rgba(240,228,216,0.4)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-fire-400 font-bold text-lg mb-8 lg:hidden">🌶️ Pepper Farm</Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cream mb-2 font-display tracking-tight">Create Account</h1>
            <p className="text-cream-dim text-sm">Start your pepper farm journey today — it's free.</p>
          </div>

          {serverError && (
            <div className="mb-5 px-4 py-3.5 rounded-xl text-sm flex items-center gap-3" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.15)', color: '#FF8866' }}>
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-dark flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Full Name
              </label>
              <input className={`input-dark ${errors.fullName ? '!border-fire-500/50' : ''}`} placeholder="Jane Smith" value={form.fullName} onChange={set('fullName')} />
              {errors.fullName && <p className="mt-1.5 text-xs text-fire-400">{errors.fullName}</p>}
            </div>
            <div>
              <label className="label-dark flex items-center gap-2">
                <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email
              </label>
              <input className={`input-dark ${errors.email ? '!border-fire-500/50' : ''}`} type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1.5 text-xs text-fire-400">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-dark flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Password
                </label>
                <input className={`input-dark ${errors.password ? '!border-fire-500/50' : ''}`} type="password" placeholder="Min. 6 chars" value={form.password} onChange={set('password')} />
                {errors.password && <p className="mt-1.5 text-xs text-fire-400">{errors.password}</p>}
              </div>
              <div>
                <label className="label-dark flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Confirm
                </label>
                <input className={`input-dark ${errors.confirmPassword ? '!border-fire-500/50' : ''}`} type="password" placeholder="Repeat" value={form.confirmPassword} onChange={set('confirmPassword')} />
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-fire-400">{errors.confirmPassword}</p>}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-fire w-full py-3.5 text-sm rounded-xl flex items-center justify-center gap-2">
              {loading ? <><Spin /> Creating...</> : <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                Create Account
              </>}
            </button>
          </form>

          <div className="mt-8 pt-6 space-y-3 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-cream-muted">Already have an account? <Link to="/login" className="text-fire-400 font-semibold hover:text-fire-300 transition-colors">Login</Link></p>
            <p className="text-cream-muted">Are you a guide? <Link to="/guide/register" className="text-cream-dim font-semibold hover:text-cream transition-colors">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
