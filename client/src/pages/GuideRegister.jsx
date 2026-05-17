import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerGuide } from '../api/auth';

const Spin = () => <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>;

export default function GuideRegister() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', jobTitle: '', experience: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => { const e = {}; if (!form.fullName.trim()) e.fullName = 'Required'; if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid'; if (form.password.length < 6) e.password = 'Min 6'; if (form.password !== form.confirmPassword) e.confirmPassword = 'Mismatch'; if (!form.jobTitle.trim()) e.jobTitle = 'Required'; return e; };
  const handleSubmit = async e => {
    e.preventDefault(); const errs = validate(); if (Object.keys(errs).length) return setErrors(errs); setErrors({}); setServerError(''); setLoading(true);
    try { await registerGuide(form); setSuccess(true); } catch (err) { setServerError(err.response?.data?.message || 'Failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-dark-300">
      <div className="hidden lg:flex lg:w-5/12 xl:w-[45%] flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #F0F7EC, #E0F0D8, #F0F7EC)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(82,171,51,0.08), transparent 70%)' }} />
        <div className="absolute top-16 right-6 w-40 h-40 opacity-[0.20] rotate-[-10deg] animate-float rounded-full" style={{ background: 'radial-gradient(circle, #52AB33, transparent 70%)' }} />
        <div className="absolute bottom-20 left-8 w-32 h-32 opacity-[0.15] rotate-[8deg] animate-float-slow rounded-full" style={{ background: 'radial-gradient(circle, #E84420, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(circle, rgba(28,17,10,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 px-12 text-center max-w-md">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 0 40px rgba(82,171,51,0.15)' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-cream mb-4 font-display tracking-tight">Become a Guide</h2>
          <p className="text-cream-dim text-sm leading-relaxed mb-10">Share your passion for peppers. Join our team of certified farm tour guides.</p>

          <div className="glass-card p-5 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream-muted mb-3">How it works</p>
            {[
              { step: '01', text: 'Submit your application' },
              { step: '02', text: 'Admin reviews your profile' },
              { step: '03', text: 'Get approved & start guiding' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(28,17,10,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)' }}>{step}</div>
                <span className="text-sm text-cream-dim">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-fire-400 font-bold text-sm mb-8 lg:hidden">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}><svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg></span>
            Pepper Farm
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-wider" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Application Form
            </div>
            <h1 className="text-3xl font-bold text-cream mb-2 font-display tracking-tight">Guide Application</h1>
            <p className="text-cream-dim text-sm">Your application will be reviewed by the admin team.</p>
          </div>

          {success ? (
            <div className="text-center py-12" style={{ animation: 'slideUp 0.5s ease-out' }}>
              <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-3xl" style={{ background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
                <svg className="w-10 h-10" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-cream mb-3 font-display">Application Submitted!</h2>
              <p className="text-cream-dim mb-6 text-sm leading-relaxed">Your registration is <strong className="text-cream">pending admin approval</strong>.<br />You'll be able to log in once approved.</p>
              <Link to="/guide/login" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 4px 20px rgba(82,171,51,0.25)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                Go to Guide Login
              </Link>
            </div>
          ) : (
            <>
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
                    Full Name *
                  </label>
                  <input className={`input-dark ${errors.fullName ? '!border-fire-500/50' : ''}`} placeholder="Your full name" value={form.fullName} onChange={set('fullName')} />
                  {errors.fullName && <p className="mt-1.5 text-xs text-fire-400">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="label-dark flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email *
                  </label>
                  <input className={`input-dark ${errors.email ? '!border-fire-500/50' : ''}`} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                  {errors.email && <p className="mt-1.5 text-xs text-fire-400">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-dark flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      Password *
                    </label>
                    <input className={`input-dark ${errors.password ? '!border-fire-500/50' : ''}`} type="password" placeholder="Min. 6 chars" value={form.password} onChange={set('password')} />
                    {errors.password && <p className="mt-1.5 text-xs text-fire-400">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="label-dark flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Confirm *
                    </label>
                    <input className={`input-dark ${errors.confirmPassword ? '!border-fire-500/50' : ''}`} type="password" placeholder="Repeat" value={form.confirmPassword} onChange={set('confirmPassword')} />
                    {errors.confirmPassword && <p className="mt-1.5 text-xs text-fire-400">{errors.confirmPassword}</p>}
                  </div>
                </div>
                <div className="pt-2" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream-muted mb-3">Professional Info</p>
                </div>
                <div>
                  <label className="label-dark flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Job Title *
                  </label>
                  <input className={`input-dark ${errors.jobTitle ? '!border-fire-500/50' : ''}`} placeholder="e.g. Senior Farm Guide" value={form.jobTitle} onChange={set('jobTitle')} />
                  {errors.jobTitle && <p className="mt-1.5 text-xs text-fire-400">{errors.jobTitle}</p>}
                </div>
                <div>
                  <label className="label-dark flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Years of Experience
                  </label>
                  <input className="input-dark" placeholder="e.g. 5 years" value={form.experience} onChange={set('experience')} />
                </div>
                <div>
                  <label className="label-dark flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    Bio <span className="text-cream-muted font-normal">(optional)</span>
                  </label>
                  <textarea className="input-dark resize-none" rows={3} placeholder="Tell us about your background and experience..." value={form.bio} onChange={set('bio')} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-50 mt-1 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 4px 20px rgba(82,171,51,0.25)' }}>
                  {loading ? <><Spin /> Submitting...</> : <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Submit Application
                  </>}
                </button>
              </form>
              <p className="mt-6 pt-6 text-center text-sm text-cream-muted" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
                Already registered? <Link to="/guide/login" className="font-semibold hover:text-cream-dim transition-colors" style={{ color: '#52AB33' }}>Login as guide</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
