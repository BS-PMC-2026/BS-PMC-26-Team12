import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginGuide } from '../api/auth';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

export default function GuideLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setServerError('');
    setIsPending(false);
    setLoading(true);
    try {
      const { data } = await loginGuide(form);
      login(data.token, data.user);
      navigate('/peppers');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      if (msg.toLowerCase().includes('pending')) setIsPending(true);
      else setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: '#faf7f4' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a2d0a 0%, #2d4a1a 50%, #4a3008 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-16 right-6 text-[120px] opacity-15" style={{ transform: 'rotate(-10deg)' }}>🌱</div>
        <div className="absolute bottom-20 left-8 text-[100px] opacity-10" style={{ transform: 'rotate(8deg)' }}>🌶️</div>
        <div className="relative z-10 px-12 text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Guide Portal
          </h2>
          <p className="text-green-200/70 text-sm leading-relaxed font-light">
            Sign in to manage tours, report issues, and access your guide dashboard.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-pepper-700 font-bold text-lg mb-6 lg:hidden">
              🌶️ Pepper Farm
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4 uppercase tracking-wider">
              🌿 Guide Access
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
              Guide Sign In
            </h1>
            <p className="text-gray-500 text-sm">Access your guide dashboard and tools.</p>
          </div>

          {isPending && (
            <div className="mb-5 px-4 py-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              <p className="font-semibold mb-1">⏳ Account Pending Approval</p>
              <p className="font-light">Your application is being reviewed by the admin team. You'll be notified once approved.</p>
            </div>
          )}

          {serverError && !isPending && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className={`input ${errors.email ? 'border-red-400' : ''}`}
                type="email" placeholder="guide@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input className={`input ${errors.password ? 'border-red-400' : ''}`}
                type="password" placeholder="Your password" value={form.password} onChange={set('password')} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3 text-sm font-semibold rounded-lg text-white transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a7c2d)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2"><Spinner /> Signing in…</span>
              ) : 'Sign In as Guide'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Not registered yet?{' '}
            <Link to="/guide/register" className="text-pepper-600 font-semibold hover:text-pepper-700">Apply as a guide →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
