import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getMyTours } from '../api/tours';
import { submitIssue } from '../api/issues';

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4 hover:scale-[1.02] transition-all">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-cream font-display">{value}</p>
        <p className="text-xs text-cream-muted font-medium">{label}</p>
      </div>
    </div>
  );
}

const SEVERITY = ['Low', 'Medium', 'High', 'Critical'];
const SEV_COLOR = { Low: '#52AB33', Medium: '#D4A053', High: '#E88C20', Critical: '#E84420' };

function ReportIssueModal({ tours, onClose }) {
  const [form, setForm] = useState({ title: '', description: '', tourId: '', severity: 'Medium' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.description || !form.tourId) return setError('Please fill in all required fields.');
    setSubmitting(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('attachment', file);
      await submitIssue(fd);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit issue.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.10)' }}>
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #E88C20, #E84420)' }} />
        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(82,171,51,0.1)' }}>
                <svg className="w-7 h-7" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p className="font-bold text-cream text-lg mb-1">Issue Reported!</p>
              <p className="text-cream-dim text-sm mb-5">Your report has been submitted to the manager.</p>
              <button onClick={onClose} className="btn-ghost px-6 py-2.5 text-sm">Close</button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-cream text-xl font-display mb-5">Report Technical Issue</h3>
              {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(232,68,32,0.08)', color: '#E84420' }}>{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-dark">Tour *</label>
                  <select className="select-dark" value={form.tourId} onChange={set('tourId')}>
                    <option value="">Select a tour…</option>
                    {tours.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-dark">Title *</label>
                  <input className="input-dark" placeholder="Brief issue title" value={form.title} onChange={set('title')} />
                </div>
                <div>
                  <label className="label-dark">Description *</label>
                  <textarea className="input-dark resize-none" rows={3} placeholder="Describe the issue in detail…" value={form.description} onChange={set('description')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-dark">Severity</label>
                    <select className="select-dark" value={form.severity} onChange={set('severity')}>
                      {SEVERITY.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-dark">Attachment (optional)</label>
                    <input type="file" accept="image/*,.pdf" className="input-dark text-xs py-2" onChange={e => setFile(e.target.files[0])} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-ghost px-5 py-2.5 text-sm flex-1">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-fire px-6 py-2.5 text-sm flex-1">{submitting ? 'Submitting…' : 'Submit Report'}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuideDashboard() {
  const { user } = useAuth();
  const [myTours, setMyTours] = useState([]);
  const [showIssueModal, setShowIssueModal] = useState(false);

  useEffect(() => {
    getMyTours().then(({ data }) => setMyTours(data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />

      <div className="relative overflow-hidden py-16 px-6 lg:px-12">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(82,171,51,0.08), transparent)' }} />
        <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: 'radial-gradient(circle, rgba(28,17,10,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            Guide Portal
          </div>
          <h1 className="text-4xl font-bold text-cream mb-1.5 font-display tracking-tight">
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-cream-dim text-sm">Your guide dashboard with pepper catalog access and account overview.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-6 pb-20 space-y-6">

        <div className="grid sm:grid-cols-3 gap-4" style={{ animation: 'slideUp 0.4s ease-out' }}>
          <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>} label="Catalog Access" value="50+" accent="#E84420" />
          <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} label="Your Status" value="Active" accent="#52AB33" />
          <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} label="Guide Role" value="Approved" accent="#D4A053" />
        </div>

        <div className="glass-card overflow-hidden" style={{ animation: 'slideUp 0.4s 0.08s ease-out both' }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #2D6A1A, #52AB33, #7DC066)' }} />
          <div className="p-6">
            <div className="flex flex-wrap items-start gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 4px 20px rgba(82,171,51,0.2)' }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h2 className="font-bold text-cream text-xl font-display tracking-tight">{user?.fullName}</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ color: '#52AB33', background: 'rgba(82,171,51,0.1)', border: '1px solid rgba(82,171,51,0.2)' }}>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#52AB33' }} />
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#52AB33' }} />
                    </span>
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-2 text-cream-muted text-sm mt-1">
                  <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-6 pt-6" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
              {[
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, label: 'Role', value: 'Farm Guide' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, label: 'Status', value: 'Active' },
                { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, label: 'Access', value: 'Catalog + Profile' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="rounded-xl px-4 py-3.5 flex items-center gap-3" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.07)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ color: '#9B7260', background: 'rgba(28,17,10,0.05)' }}>{icon}</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream-muted">{label}</p>
                    <p className="text-sm font-bold text-cream">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4" style={{ animation: 'slideUp 0.4s 0.16s ease-out both' }}>
          <Link to="/peppers" className="group glass-card overflow-hidden hover:scale-[1.02] transition-all">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #C23610, #E84420)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.12)' }}>
                <svg className="w-6 h-6" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1 group-hover:text-fire-400 transition-colors">Browse Pepper Catalog</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">Search and explore 50+ pepper varieties — heat levels, origins, and more.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#E84420' }}>
                  Open catalog
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </Link>

          <Link to="/" className="glass-card overflow-hidden hover:scale-[1.02] transition-all">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #D4A053, #E88C20)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.12)' }}>
                <svg className="w-6 h-6" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1">View Main Experience</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">Open the home page and review the full visitor journey design.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#D4A053' }}>
                  Open home
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </Link>

          <Link to="/guide/past-tours" className="group glass-card overflow-hidden hover:scale-[1.02] transition-all">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #D4A053, #E88C20)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.12)' }}>
                <svg className="w-6 h-6" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1 group-hover:text-fire-400 transition-colors">Past Tours & Ratings</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">View visitor feedback and star ratings for your completed tours.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#D4A053' }}>
                  View ratings
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </Link>

          <button onClick={() => setShowIssueModal(true)} className="group glass-card overflow-hidden hover:scale-[1.02] transition-all text-left w-full">
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #E88C20, #E84420)' }} />
            <div className="p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.12)' }}>
                <svg className="w-6 h-6" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-cream mb-1 group-hover:text-fire-400 transition-colors">Report Technical Issue</h3>
                <p className="text-cream-dim text-sm leading-relaxed mb-3">Submit a technical problem or equipment issue related to your tours.</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold transition-all" style={{ color: '#E84420' }}>
                  Report issue
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </div>
            </div>
          </button>
        </div>

        {showIssueModal && <ReportIssueModal tours={myTours} onClose={() => setShowIssueModal(false)} />}
      </div>
    </div>
  );
}
