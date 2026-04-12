import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getGuides, updateGuideStatus, deleteGuide, getUsers, deleteUser } from '../api/users';
import { getPeppers, addPepper, deletePepper } from '../api/peppers';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const guideStatusStyle = {
  pending:  { bg: 'bg-amber-50',   text: 'text-amber-700',   label: 'Pending'  },
  approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Approved' },
  rejected: { bg: 'bg-red-50',     text: 'text-red-600',     label: 'Rejected' },
};

const HEAT_CONFIG = {
  'None':     { bg: 'bg-gray-100',  text: 'text-gray-500'   },
  'Mild':     { bg: 'bg-green-50',  text: 'text-green-700'  },
  'Medium':   { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'Hot':      { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Very Hot': { bg: 'bg-red-50',    text: 'text-red-700'    },
  'Extreme':  { bg: 'bg-gray-900',  text: 'text-red-400'    },
};

// ── Confirm dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel}/>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="text-3xl mb-3 text-center">⚠️</div>
        <p className="text-center font-semibold text-gray-800 mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 py-2.5 text-sm">Cancel</button>
          <button onClick={onConfirm} className="btn-danger flex-1 py-2.5 text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Guides Panel ──────────────────────────────────────────────────────────────
function GuidesPanel() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    getGuides().then(({ data }) => setGuides(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    setActing(id + status);
    try {
      const { data } = await updateGuideStatus(id, { status });
      setGuides(prev => prev.map(g => g._id === data._id ? data : g));
    } catch {}
    finally { setActing(null); }
  };

  const handleDelete = async (id) => {
    setActing(id + 'del');
    setConfirm(null);
    try {
      await deleteGuide(id);
      setGuides(prev => prev.filter(g => g._id !== id));
    } catch {}
    finally { setActing(null); }
  };

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card rounded-xl h-16 animate-pulse"/>)}</div>;
  if (!guides.length) return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">🌱</p>
      <p className="text-gray-500 text-sm">No guide applications yet.</p>
    </div>
  );

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={`Delete guide "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <p className="text-xs text-gray-400 mb-4">{guides.length} guide{guides.length !== 1 ? 's' : ''} total</p>
      <div className="space-y-3">
        {guides.map(guide => {
          const s = guideStatusStyle[guide.status] || guideStatusStyle.pending;
          return (
            <div key={guide._id} className="card rounded-2xl p-4 flex flex-wrap items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a7c2d)' }}>
                {guide.fullName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-900 text-sm">{guide.fullName}</span>
                  <span className={`badge text-xs ${s.bg} ${s.text}`}>{s.label}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {guide.email} · {guide.jobTitle}{guide.experience ? ` · ${guide.experience}` : ''}
                </p>
                <p className="text-[11px] text-gray-300 mt-0.5">Joined {fmtDate(guide.createdAt)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0 flex-wrap">
                {guide.status !== 'approved' && (
                  <button disabled={!!acting} onClick={() => handleStatus(guide._id, 'approved')}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white transition disabled:opacity-50"
                    style={{ background: '#2d5a1b' }}>Approve</button>
                )}
                {guide.status !== 'rejected' && (
                  <button disabled={!!acting} onClick={() => handleStatus(guide._id, 'rejected')}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-50">Reject</button>
                )}
                {guide.status !== 'pending' && (
                  <button disabled={!!acting} onClick={() => handleStatus(guide._id, 'pending')}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 transition disabled:opacity-50">Reset</button>
                )}
                <button disabled={!!acting} onClick={() => setConfirm({ id: guide._id, name: guide.fullName })}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-200 text-gray-400 bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-50">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ── Users Panel ───────────────────────────────────────────────────────────────
function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    getUsers().then(({ data }) => setUsers(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setActing(id);
    setConfirm(null);
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {}
    finally { setActing(null); }
  };

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="card rounded-xl h-14 animate-pulse"/>)}</div>;
  if (!users.length) return (
    <div className="text-center py-16">
      <p className="text-4xl mb-3">👥</p>
      <p className="text-gray-500 text-sm">No visitors registered yet.</p>
    </div>
  );

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={`Delete user "${confirm.name}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <p className="text-xs text-gray-400 mb-4">{users.length} visitor{users.length !== 1 ? 's' : ''} registered</p>
      <div className="space-y-2.5">
        {users.map(user => (
          <div key={user._id} className="card rounded-xl px-5 py-3.5 flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #c1440e, #e85d2c)' }}>
              {user.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm">{user.fullName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email} · Joined {fmtDate(user.createdAt)}</p>
            </div>
            <button disabled={!!acting} onClick={() => setConfirm({ id: user._id, name: user.fullName })}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-50 flex-shrink-0">
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Peppers Panel ─────────────────────────────────────────────────────────────
function PeppersPanel() {
  const [peppers, setPeppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', origin: '', color: '', heatLevel: 'Medium' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [acting, setActing] = useState(null);

  const load = () => {
    setLoading(true);
    getPeppers().then(({ data }) => setPeppers(data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    return e;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setServerError('');
    setSubmitting(true);
    try {
      await addPepper(form);
      setForm({ name: '', description: '', imageUrl: '', origin: '', color: '', heatLevel: 'Medium' });
      setShowForm(false);
      setSuccess('Pepper added successfully!');
      load();
      setTimeout(() => setSuccess(''), 3500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to add pepper.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setActing(id);
    setConfirm(null);
    try {
      await deletePepper(id);
      setPeppers(prev => prev.filter(p => p._id !== id));
    } catch {}
    finally { setActing(null); }
  };

  return (
    <>
      {confirm && (
        <ConfirmDialog
          message={`Delete pepper "${confirm.name}"?`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs text-gray-400">{peppers.length} pepper{peppers.length !== 1 ? 's' : ''} in catalog</p>
        <button onClick={() => { setShowForm(f => !f); setErrors({}); setServerError(''); }}
          className="btn-primary text-sm py-2 px-4">
          {showForm ? '✕ Cancel' : '+ Add Pepper'}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          ✅ {success}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="card rounded-2xl overflow-hidden mb-6">
          <div className="h-1" style={{ background: 'linear-gradient(to right, #c1440e, #e85d2c)' }}/>
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: "'Lora', serif" }}>Add New Pepper</h3>
            {serverError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">⚠ {serverError}</div>
            )}
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name <span className="text-red-400">*</span></label>
                  <input className={`input ${errors.name ? 'border-red-400' : ''}`}
                    placeholder="e.g. Carolina Reaper" value={form.name} onChange={set('name')}/>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">Heat Level</label>
                  <select className="input" value={form.heatLevel} onChange={set('heatLevel')}>
                    {['None','Mild','Medium','Hot','Very Hot','Extreme'].map(h => <option key={h}>{h}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description <span className="text-red-400">*</span></label>
                <textarea className={`input resize-none ${errors.description ? 'border-red-400' : ''}`}
                  rows={3} placeholder="Describe the pepper's taste, uses, characteristics…"
                  value={form.description} onChange={set('description')}/>
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Origin</label>
                  <input className="input" placeholder="e.g. Mexico" value={form.origin} onChange={set('origin')}/>
                </div>
                <div>
                  <label className="label">Color</label>
                  <input className="input" placeholder="e.g. Red / Green" value={form.color} onChange={set('color')}/>
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input className="input" placeholder="https://…" value={form.imageUrl} onChange={set('imageUrl')}/>
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary text-sm py-2.5 px-6">
                {submitting
                  ? <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Adding…
                    </span>
                  : 'Add Pepper'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pepper list */}
      {loading ? (
        <div className="space-y-2.5">{[1,2,3].map(i => <div key={i} className="card rounded-xl h-14 animate-pulse"/>)}</div>
      ) : peppers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🌶️</p>
          <p className="text-gray-500 text-sm">No peppers in the catalog yet. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {peppers.map(pepper => {
            const h = HEAT_CONFIG[pepper.heatLevel] || HEAT_CONFIG['Medium'];
            return (
              <div key={pepper._id} className="card rounded-xl px-5 py-3.5 flex items-center gap-4">
                <div className="text-xl flex-shrink-0">🌶️</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900 text-sm">{pepper.name}</span>
                    <span className={`badge text-[11px] font-bold ${h.bg} ${h.text}`}>{pepper.heatLevel}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {pepper.origin && `${pepper.origin} · `}{pepper.description?.slice(0, 70)}…
                  </p>
                </div>
                <button disabled={!!acting} onClick={() => setConfirm({ id: pepper._id, name: pepper.name })}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition disabled:opacity-50 flex-shrink-0">
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('guides');

  const tabs = [
    { key: 'guides',  label: '🌱 Guides'  },
    { key: 'users',   label: '👥 Users'   },
    { key: 'peppers', label: '🌶️ Peppers' },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');`}</style>
      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f0f0f 0%, #1a0505 60%, #0d1a0a 100%)' }}>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[100px] opacity-10 select-none">🔐</div>
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pepper-900/40 border border-pepper-700/50 text-pepper-400 text-xs font-bold uppercase tracking-widest mb-4">
            🔐 Administrator
          </div>
          <h1 className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm font-light">Manage guides, visitors, and the pepper catalog.</p>
        </div>
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 32V16C480 0 960 32 1440 16V32H0Z" fill="#faf7f4"/>
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-gray-200 w-fit shadow-sm">
          {tabs.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'guides'  && <GuidesPanel  />}
        {tab === 'users'   && <UsersPanel   />}
        {tab === 'peppers' && <PeppersPanel />}
      </div>
    </div>
  );
}
