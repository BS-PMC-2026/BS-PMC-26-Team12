import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginAdmin } from '../api/auth';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
  </svg>
);

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
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
    setLoading(true);
    try {
      const { data } = await loginAdmin(form);
      login(data.token, data.user);
      navigate('/admin');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Access denied. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'linear-gradient(145deg, #0f0f0f 0%, #1a0505 50%, #0d1a0a 100%)',
      }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #e84316 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #4a7c2d 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='15' cy='15' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-6">
        {/* Header accent bar */}
        <div className="h-1 w-full rounded-t-xl" style={{ background: 'linear-gradient(to right, #c1440e, #e84316, #4a7c2d)' }} />

        <div className="bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-b-xl px-8 py-10">

          {/* Badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #c1440e, #e84316)' }}>
              🔐
            </div>
            <div>
              <div className="text-[10px] font-bold text-pepper-400 uppercase tracking-widest">Restricted Area</div>
              <div className="text-xs text-gray-500">Administrator Access Only</div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Admin Login
          </h1>
          <p className="text-gray-500 text-sm mb-8">Authorized personnel only. All access is logged.</p>

          {serverError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-900/30 border border-red-800/50 text-red-400 text-sm flex items-center gap-2">
              <span>⚠</span> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 border transition focus:outline-none focus:ring-2 focus:ring-pepper-500 focus:border-transparent ${
                  errors.email ? 'border-red-700 bg-red-900/10' : 'border-white/10 bg-white/5'
                }`}
                type="email" placeholder="admin@peppers.com"
                value={form.email} onChange={set('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
              <input
                className={`w-full px-3.5 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 border transition focus:outline-none focus:ring-2 focus:ring-pepper-500 focus:border-transparent ${
                  errors.password ? 'border-red-700 bg-red-900/10' : 'border-white/10 bg-white/5'
                }`}
                type="password" placeholder="••••••••"
                value={form.password} onChange={set('password')} />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #c1440e, #e84316)', boxShadow: '0 4px 20px rgba(193,68,14,0.3)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2"><Spinner /> Authenticating…</span>
              ) : 'Access Admin Panel'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
              ← Back to Pepper Farm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
