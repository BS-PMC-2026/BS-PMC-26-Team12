import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerVisitor } from '../api/auth';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

export default function VisitorRegister() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      const { data } = await registerVisitor(form);
      login(data.token, data.user);
      navigate('/peppers');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: '#faf7f4' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0a00 0%, #4a1a08 40%, #2d4a1a 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-20 right-8 text-[160px] opacity-15" style={{ transform: 'rotate(-15deg)' }}>🌶️</div>
        <div className="absolute bottom-24 left-6 text-[90px] opacity-10" style={{ transform: 'rotate(10deg)' }}>🌱</div>
        <div className="relative z-10 px-12 text-center">
          <div className="text-5xl mb-6">🌶️</div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Join the Farm
          </h2>
          <p className="text-orange-200/70 text-sm leading-relaxed font-light">
            Create your account and start exploring guided tours through our world-class pepper fields.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {['50+ Tour Options', 'Email Confirmation', 'Expert Guides'].map(t => (
              <div key={t} className="flex items-center gap-3 text-orange-100/80 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: 'rgba(255,107,53,0.3)' }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-pepper-700 font-bold text-lg mb-6 lg:hidden">
              🌶️ Pepper Farm
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">Start your pepper farm journey today.</p>
          </div>

          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className={`input ${errors.fullName ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Jane Smith" value={form.fullName} onChange={set('fullName')} />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className={`input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                type="email" placeholder="jane@example.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input className={`input ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input className={`input ${errors.confirmPassword ? 'border-red-400 focus:ring-red-400' : ''}`}
                type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={set('confirmPassword')} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3 text-sm">
              {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
            <p>Already have an account?{' '}
              <Link to="/login" className="text-pepper-600 font-semibold hover:text-pepper-700">Login</Link>
            </p>
            <p>Are you a guide?{' '}
              <Link to="/guide/register" className="text-pepper-600 font-semibold hover:text-pepper-700">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
