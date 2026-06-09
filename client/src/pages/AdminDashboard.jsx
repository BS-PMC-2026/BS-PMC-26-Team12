import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getGuides, updateGuideStatus, deleteGuide, getUsers, deleteUser } from '../api/users';
import { getPeppers, addPepper, updatePepper, deletePepper } from '../api/peppers';
import { getAllFeedback, deleteFeedback } from '../api/feedback';
import { getIssues, updateIssueStatus } from '../api/issues';

const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const HC = { 'None':'#8B7355','Mild':'#52AB33','Medium':'#D4A053','Hot':'#E88C20','Very Hot':'#E84420','Extreme':'#9A2B0D' };

function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.10)' }}>
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #E84420, #D4A053)' }} />
        <div className="p-7 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.1)', border: '1px solid rgba(232,68,32,0.15)' }}>
            <svg className="w-7 h-7" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="font-bold text-cream text-base mb-2">Are you sure?</p>
          <p className="text-cream-dim text-sm mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 text-sm font-bold rounded-xl transition-all" style={{ color: '#5A3D2B', border: '1px solid rgba(28,17,10,0.12)', background: 'rgba(28,17,10,0.04)' }}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 text-sm font-bold rounded-xl text-white transition-all" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)', boxShadow: '0 4px 16px rgba(232,68,32,0.3)' }}>Yes, Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditPepperModal({ pepper, saving, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: pepper.name || '',
    description: pepper.description || '',
    imageUrl: pepper.imageUrl || '',
    origin: pepper.origin || '',
    color: pepper.color || '',
    scoville: pepper.scoville || '',
    heatLevel: pepper.heatLevel || 'Medium',
  });
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.scoville.trim()) e.scoville = 'Required';
    return e;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(28,17,10,0.10)' }}>
        <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #9A2B0D, #C23610, #D4A053)' }} />
        <div className="p-6">
          <h3 className="font-bold text-cream mb-5 text-xl font-display">Edit Pepper</h3>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label-dark">Pepper Name *</label><input className={`input-dark ${errors.name ? '!border-fire-500/50' : ''}`} value={form.name} onChange={set('name')} />{errors.name && <p className="mt-1 text-xs text-fire-400">{errors.name}</p>}</div>
              <div><label className="label-dark">Heat Level</label><select className="select-dark" value={form.heatLevel} onChange={set('heatLevel')}>{['None', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme'].map(h => <option key={h}>{h}</option>)}</select></div>
            </div>
            <div><label className="label-dark">Description *</label><textarea className={`input-dark resize-none ${errors.description ? '!border-fire-500/50' : ''}`} rows={3} value={form.description} onChange={set('description')} />{errors.description && <p className="mt-1 text-xs text-fire-400">{errors.description}</p>}</div>
            <div className="grid sm:grid-cols-4 gap-4">
              <div><label className="label-dark">Origin</label><input className="input-dark" value={form.origin} onChange={set('origin')} /></div>
              <div><label className="label-dark">Color</label><input className="input-dark" value={form.color} onChange={set('color')} /></div>
              <div><label className="label-dark">Scoville (SHU) *</label><input className={`input-dark ${errors.scoville ? '!border-fire-500/50' : ''}`} value={form.scoville} onChange={set('scoville')} />{errors.scoville && <p className="mt-1 text-xs text-fire-400">{errors.scoville}</p>}</div>
              <div><label className="label-dark">Image URL</label><input className="input-dark" value={form.imageUrl} onChange={set('imageUrl')} /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onCancel} className="btn-ghost px-5 py-2.5 text-sm">Cancel</button>
              <button type="submit" disabled={saving} className="btn-fire px-6 py-2.5 text-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-cream font-display">{value}</p>
        <p className="text-xs text-cream-muted font-medium">{label}</p>
      </div>
    </div>
  );
}

function GuidesPanel() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { getGuides().then(({ data }) => setGuides(data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const hs = async (id, status) => { setActing(id + status); try { const { data } = await updateGuideStatus(id, { status }); setGuides(p => p.map(g => g._id === data._id ? data : g)); } catch {} finally { setActing(null); } };
  const hd = async id => { setActing(id + 'del'); setConfirm(null); try { await deleteGuide(id); setGuides(p => p.filter(g => g._id !== id)); } catch {} finally { setActing(null); } };

  const pending = guides.filter(g => g.status === 'pending').length;
  const approved = guides.filter(g => g.status === 'approved').length;

  if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>;
  if (!guides.length) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(82,171,51,0.08)' }}>
        <svg className="w-9 h-9" style={{ color: '#52AB33' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
      </div>
      <h3 className="text-lg font-bold text-cream mb-2">No Applications Yet</h3>
      <p className="text-cream-muted text-sm">Guide applications will appear here once submitted.</p>
    </div>
  );

  return (
    <>
      {confirm && <Confirm message={`This will permanently remove "${confirm.name}" from the system.`} onConfirm={() => hd(confirm.id)} onCancel={() => setConfirm(null)} />}

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Total Guides" value={guides.length} accent="#D4A053" />
        <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Pending Review" value={pending} accent="#E88C20" />
        <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Approved" value={approved} accent="#52AB33" />
      </div>

      <div className="space-y-3">
        {guides.map((g, i) => {
          const statusMap = {
            pending:  { c: '#D4A053', bg: 'rgba(212,160,83,0.1)', border: 'rgba(212,160,83,0.2)', label: 'Pending' },
            approved: { c: '#52AB33', bg: 'rgba(82,171,51,0.1)',  border: 'rgba(82,171,51,0.2)',  label: 'Approved' },
            rejected: { c: '#E84420', bg: 'rgba(232,68,32,0.1)',  border: 'rgba(232,68,32,0.2)',  label: 'Rejected' },
          };
          const s = statusMap[g.status] || statusMap.pending;

          return (
            <div key={g._id} className="glass-card overflow-hidden hover:scale-[1.005] transition-all" style={{ animation: `slideUp 0.3s ${i * 0.05}s ease-out both` }}>
              <div className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-base flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)' }}>
                    {g.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-cream">{g.fullName}</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ color: s.c, background: s.bg, border: `1px solid ${s.border}` }}>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.c }} /> {s.label}
                      </span>
                    </div>
                    <p className="text-sm text-cream-dim">{g.jobTitle}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-cream-muted">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        {g.email}
                      </span>
                      {g.experience && <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        {g.experience}
                      </span>}
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        {fmtDate(g.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 flex-wrap" style={{ borderTop: '1px solid rgba(28,17,10,0.07)' }}>
                  {g.status !== 'approved' && (
                    <button disabled={!!acting} onClick={() => hs(g._id, 'approved')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-40 hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #2D6A1A, #52AB33)', boxShadow: '0 2px 10px rgba(82,171,51,0.2)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                      Approve
                    </button>
                  )}
                  {g.status !== 'rejected' && (
                    <button disabled={!!acting} onClick={() => hs(g._id, 'rejected')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 hover:scale-[1.02]"
                      style={{ color: '#E84420', background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.15)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                      Reject
                    </button>
                  )}
                  {g.status !== 'pending' && (
                    <button disabled={!!acting} onClick={() => hs(g._id, 'pending')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 hover:scale-[1.02]"
                      style={{ color: '#5A3D2B', border: '1px solid rgba(28,17,10,0.10)', background: 'rgba(28,17,10,0.04)' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                      Reset
                    </button>
                  )}
                  <button disabled={!!acting} onClick={() => setConfirm({ id: g._id, name: g.fullName })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 hover:scale-[1.02] ml-auto"
                    style={{ color: '#9B7260', border: '1px solid rgba(28,17,10,0.08)', background: 'transparent' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [acting, setActing] = useState(null);

  useEffect(() => { getUsers().then(({ data }) => setUsers(data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const hd = async id => { setActing(id); setConfirm(null); try { await deleteUser(id); setUsers(p => p.filter(u => u._id !== id)); } catch {} finally { setActing(null); } };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)}</div>;
  if (!users.length) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.08)' }}>
        <svg className="w-9 h-9" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </div>
      <h3 className="text-lg font-bold text-cream mb-2">No Visitors Yet</h3>
      <p className="text-cream-muted text-sm">Registered visitors will appear here.</p>
    </div>
  );

  return (
    <>
      {confirm && <Confirm message={`This will permanently remove "${confirm.name}".`} onConfirm={() => hd(confirm.id)} onCancel={() => setConfirm(null)} />}

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} label="Total Visitors" value={users.length} accent="#E84420" />
        <StatCard icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Latest Signup" value={users.length ? fmtDate(users[users.length - 1].createdAt) : '—'} accent="#D4A053" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.15em] text-cream-muted" style={{ borderBottom: '1px solid rgba(28,17,10,0.08)' }}>
          <div className="w-9" />
          <div className="flex-1">Name</div>
          <div className="hidden sm:block w-48">Email</div>
          <div className="hidden sm:block w-28">Joined</div>
          <div className="w-20 text-right">Action</div>
        </div>
        {users.map((u, i) => (
          <div key={u._id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#D4A05314] hover:shadow-[inset_0_0_0_1px_rgba(212,160,83,0.18)] transition-all duration-200" style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(28,17,10,0.05)' : 'none', background: i % 2 ? 'rgba(28,17,10,0.025)' : 'transparent' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
              {u.fullName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-cream text-sm truncate">{u.fullName}</p>
              <p className="text-xs text-cream-muted sm:hidden truncate">{u.email}</p>
            </div>
            <div className="hidden sm:block w-48 text-sm text-cream-dim truncate">{u.email}</div>
            <div className="hidden sm:block w-28 text-xs text-cream-muted">{fmtDate(u.createdAt)}</div>
            <div className="w-20 flex justify-end">
              <button disabled={!!acting} onClick={() => setConfirm({ id: u._id, name: u.fullName })}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 hover:!text-[#D4A053] hover:!border-[#D4A05366] hover:!bg-[#D4A05312]"
                style={{ color: '#9B7260', border: '1px solid rgba(28,17,10,0.08)' }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PeppersPanel() {
  const [peppers, setPeppers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '', origin: '', color: '', scoville: '', heatLevel: 'Medium' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [serverError, setServerError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [acting, setActing] = useState(null);
  const [editingPepper, setEditingPepper] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = () => { setLoading(true); getPeppers().then(({ data }) => setPeppers(data)).catch(() => {}).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.scoville.trim()) e.scoville = 'Required';
    return e;
  };
  const handleAdd = async e => {
    e.preventDefault(); const errs = validate(); if (Object.keys(errs).length) return setErrors(errs); setErrors({}); setServerError(''); setSubmitting(true);
    try { await addPepper(form); setForm({ name: '', description: '', imageUrl: '', origin: '', color: '', scoville: '', heatLevel: 'Medium' }); setShowForm(false); setSuccess('Pepper added!'); load(); setTimeout(() => setSuccess(''), 3500); }
    catch (err) { setServerError(err.response?.data?.message || 'Failed.'); } finally { setSubmitting(false); }
  };
  const handleDel = async id => { setActing(id); setConfirm(null); try { await deletePepper(id); setPeppers(p => p.filter(x => x._id !== id)); } catch {} finally { setActing(null); } };
  const handleEditSave = async (form) => {
    if (!editingPepper) return;
    setSavingEdit(true);
    try {
      const { data } = await updatePepper(editingPepper._id, form);
      setPeppers(prev => prev.map(p => (p._id === data._id ? data : p)));
      setEditingPepper(null);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to update pepper.');
    } finally {
      setSavingEdit(false);
    }
  };
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredPeppers = normalizedSearch
    ? peppers.filter(p =>
      [p.name, p.origin, p.heatLevel, p.scoville]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    )
    : peppers;

  return (
    <>
      {confirm && <Confirm message={`Delete "${confirm.name}" from catalog?`} onConfirm={() => handleDel(confirm.id)} onCancel={() => setConfirm(null)} />}
      {editingPepper && <EditPepperModal pepper={editingPepper} saving={savingEdit} onCancel={() => setEditingPepper(null)} onSave={handleEditSave} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-cream-muted font-bold uppercase tracking-[0.15em]">Pepper Catalog</p>
          <p className="text-cream-dim text-sm mt-0.5">{filteredPeppers.length} of {peppers.length} pepper{peppers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowForm(f => !f); setErrors({}); setServerError(''); }}
          className={showForm ? 'btn-ghost px-5 py-3 text-sm' : 'btn-fire px-5 py-3 text-sm'}>
          {showForm ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Cancel</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Pepper</>
          )}
        </button>
      </div>
      <div className="glass-card p-3 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            className="input-dark !pl-10 !py-3"
            placeholder="Search by pepper name, origin, heat, or scoville..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="btn-ghost px-4 py-3 text-sm">
            Clear Search
          </button>
        )}
      </div>

      {success && <div className="mb-5 px-5 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2" style={{ background: 'rgba(82,171,51,0.08)', border: '1px solid rgba(82,171,51,0.15)', color: '#52AB33' }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> {success}
      </div>}

      {showForm && (
        <div className="glass-card overflow-hidden mb-6" style={{ animation: 'slideUp 0.3s ease-out' }}>
          <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, #C23610, #E84420, #D4A053)' }} />
          <div className="p-6">
            <h3 className="font-bold text-cream mb-5 text-lg font-display">Add New Pepper</h3>
            {serverError && <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{ background: 'rgba(232,68,32,0.1)', border: '1px solid rgba(232,68,32,0.2)', color: '#FF8866' }}><svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>{serverError}</div>}
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="label-dark">Pepper Name *</label><input className={`input-dark ${errors.name ? '!border-fire-500/50' : ''}`} placeholder="e.g. Carolina Reaper" value={form.name} onChange={set('name')} />{errors.name && <p className="mt-1 text-xs text-fire-400">{errors.name}</p>}</div>
                <div><label className="label-dark">Heat Level</label><select className="select-dark" value={form.heatLevel} onChange={set('heatLevel')}>{['None', 'Mild', 'Medium', 'Hot', 'Very Hot', 'Extreme'].map(h => <option key={h}>{h}</option>)}</select></div>
              </div>
              <div><label className="label-dark">Description *</label><textarea className={`input-dark resize-none ${errors.description ? '!border-fire-500/50' : ''}`} rows={3} placeholder="Describe the pepper's taste, uses, and characteristics..." value={form.description} onChange={set('description')} />{errors.description && <p className="mt-1 text-xs text-fire-400">{errors.description}</p>}</div>
              <div className="grid sm:grid-cols-4 gap-4">
                <div><label className="label-dark">Origin</label><input className="input-dark" placeholder="e.g. Mexico" value={form.origin} onChange={set('origin')} /></div>
                <div><label className="label-dark">Color</label><input className="input-dark" placeholder="e.g. Red" value={form.color} onChange={set('color')} /></div>
                <div><label className="label-dark">Scoville (SHU) *</label><input className={`input-dark ${errors.scoville ? '!border-fire-500/50' : ''}`} placeholder="e.g. 100,000-350,000 SHU" value={form.scoville} onChange={set('scoville')} />{errors.scoville && <p className="mt-1 text-xs text-fire-400">{errors.scoville}</p>}</div>
                <div><label className="label-dark">Image URL</label><input className="input-dark" placeholder="https://..." value={form.imageUrl} onChange={set('imageUrl')} /></div>
              </div>
              <button type="submit" disabled={submitting} className="btn-fire text-sm py-3 px-7">
                {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Adding...</span>
                : <span className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Pepper</span>}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)}</div>
      : peppers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.08)' }}>
            <svg className="w-9 h-9" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-cream mb-2">Catalog Empty</h3>
          <p className="text-cream-muted text-sm">Add the first pepper to get started.</p>
        </div>
      ) : filteredPeppers.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.08)' }}>
            <svg className="w-8 h-8" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-cream mb-2">No matching peppers</h3>
          <p className="text-cream-muted text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.15em] text-cream-muted" style={{ borderBottom: '1px solid rgba(28,17,10,0.08)' }}>
            <div className="w-8" />
            <div className="flex-1">Pepper</div>
            <div className="hidden sm:block w-24">Heat</div>
            <div className="hidden md:block w-32">Scoville</div>
            <div className="hidden sm:block w-32">Origin</div>
            <div className="w-32 text-right">Action</div>
          </div>
          {filteredPeppers.map((p, i) => {
            const hc = HC[p.heatLevel] || HC['Medium'];
            return (
              <div key={p._id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-[#D4A05314] hover:shadow-[inset_0_0_0_1px_rgba(212,160,83,0.18)] transition-all duration-200" style={{ borderBottom: i < peppers.length - 1 ? '1px solid rgba(28,17,10,0.05)' : 'none', background: i % 2 ? 'rgba(28,17,10,0.025)' : 'transparent' }}>
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: hc }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-cream text-sm">{p.name}</p>
                  <p className="text-xs text-cream-muted truncate mt-0.5">{p.description?.slice(0, 45)}...</p>
                </div>
                <div className="hidden sm:block w-24">
                  <span className="badge text-[11px] font-bold" style={{ color: hc, background: `${hc}12` }}>{p.heatLevel}</span>
                </div>
                <div className="hidden md:block w-32 text-sm text-cream-dim truncate">{p.scoville || '—'}</div>
                <div className="hidden sm:block w-32 text-sm text-cream-dim truncate">{p.origin || '—'}</div>
                <div className="w-32 flex justify-end gap-2">
                  <button onClick={() => setEditingPepper(p)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all hover:brightness-110 hover:scale-[1.02]"
                    style={{ color: '#D4A053', border: '1px solid rgba(212,160,83,0.25)', background: 'rgba(212,160,83,0.08)', boxShadow: '0 6px 14px rgba(212,160,83,0.14)' }}>
                    Edit
                  </button>
                  <button disabled={!!acting} onClick={() => setConfirm({ id: p._id, name: p.name })}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-40 hover:!text-[#D4A053] hover:!border-[#D4A05366] hover:!bg-[#D4A05312]"
                    style={{ color: '#9B7260', border: '1px solid rgba(28,17,10,0.08)' }}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function StarDisplay({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3.5 h-3.5" fill={i <= rating ? '#D4A053' : 'none'} stroke="#D4A053" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </span>
  );
}

function FeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null);
  const [acting, setActing] = useState(null);

  useEffect(() => { getAllFeedback().then(({ data }) => setFeedbacks(data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleDelete = async (id) => {
    setActing(id); setConfirm(null);
    try { await deleteFeedback(id); setFeedbacks(p => p.filter(f => f._id !== id)); }
    catch {} finally { setActing(null); }
  };

  const grouped = feedbacks.reduce((acc, f) => {
    const title = f.tourId?.title || 'Unknown Tour';
    if (!acc[title]) acc[title] = [];
    acc[title].push(f);
    return acc;
  }, {});

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)}</div>;
  if (!feedbacks.length) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(212,160,83,0.08)' }}>
        <svg className="w-9 h-9" style={{ color: '#D4A053' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
      </div>
      <h3 className="text-lg font-bold text-cream mb-2">No Feedback Yet</h3>
      <p className="text-cream-muted text-sm">Visitor ratings will appear here once submitted.</p>
    </div>
  );

  return (
    <>
      {confirm && <Confirm message={`Delete this review?`} onConfirm={() => handleDelete(confirm.id)} onCancel={() => setConfirm(null)} />}
      <div className="space-y-6">
        {Object.entries(grouped).map(([tourTitle, items]) => (
          <div key={tourTitle} className="glass-card overflow-hidden">
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(28,17,10,0.08)', background: 'rgba(28,17,10,0.02)' }}>
              <p className="font-bold text-cream text-sm">{tourTitle}</p>
              <span className="text-xs text-cream-muted">{items.length} review{items.length !== 1 ? 's' : ''}</span>
            </div>
            {items.map((f, i) => (
              <div key={f._id} className="px-5 py-4 flex items-start gap-4"
                style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(28,17,10,0.05)' : 'none' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs flex-shrink-0" style={{ background: 'linear-gradient(135deg, #C23610, #E84420)' }}>
                  {f.userId?.fullName?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-cream text-sm">{f.userId?.fullName || 'Visitor'}</span>
                    <StarDisplay rating={f.rating} />
                  </div>
                  {f.comment && <p className="text-sm text-cream-dim">{f.comment}</p>}
                  <p className="text-xs text-cream-muted mt-1">{fmtDate(f.createdAt)}</p>
                </div>
                <button disabled={!!acting} onClick={() => setConfirm({ id: f._id })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02]"
                  style={{ color: '#9B7260', border: '1px solid rgba(28,17,10,0.08)' }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

const SEV_COLOR = { Low: '#52AB33', Medium: '#D4A053', High: '#E88C20', Critical: '#E84420' };
const STATUS_COLOR = { Pending: '#9B7260', 'In Progress': '#D4A053', Done: '#52AB33' };

function IssuesPanel() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', managerNotes: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { getIssues().then(({ data }) => setIssues(data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const handleUpdate = async (id) => {
    if (!statusForm.status) return;
    setUpdating(id);
    try {
      const { data } = await updateIssueStatus(id, statusForm);
      setIssues(p => p.map(i => i._id === id ? data : i));
      setEditingId(null);
      setStatusForm({ status: '', managerNotes: '' });
    } catch {} finally { setUpdating(null); }
  };

  const statuses = ['All', 'Pending', 'In Progress', 'Done'];
  const filtered = filter === 'All' ? issues : issues.filter(i => i.status === filter);

  if (loading) return <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)}</div>;
  if (!issues.length) return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(232,68,32,0.08)' }}>
        <svg className="w-9 h-9" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      </div>
      <h3 className="text-lg font-bold text-cream mb-2">No Issues Reported</h3>
      <p className="text-cream-muted text-sm">Technical issues submitted by guides will appear here.</p>
    </div>
  );

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={filter === s
              ? { background: 'linear-gradient(135deg, #9A2B0D, #C23610)', color: 'white' }
              : { color: '#9B7260', border: '1px solid rgba(28,17,10,0.10)', background: 'transparent' }}>
            {s} {s !== 'All' && `(${issues.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(issue => {
          const isOpen = expanded === issue._id;
          const sevColor = SEV_COLOR[issue.severity] || '#D4A053';
          const stColor = STATUS_COLOR[issue.status] || '#9B7260';
          return (
            <div key={issue._id} className="glass-card overflow-hidden">
              <button className="w-full flex items-center gap-4 p-5 text-left" onClick={() => setExpanded(isOpen ? null : issue._id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-cream text-sm">{issue.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ color: sevColor, background: `${sevColor}15` }}>{issue.severity}</span>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ color: stColor, background: `${stColor}15` }}>{issue.status}</span>
                  </div>
                  <p className="text-xs text-cream-muted">{issue.guideId?.fullName} · {issue.tourId?.title} · {fmtDate(issue.createdAt)}</p>
                </div>
                <svg className={`w-4 h-4 text-cream-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(28,17,10,0.08)' }}>
                  <p className="text-sm text-cream-dim leading-relaxed mt-4 mb-3">{issue.description}</p>
                  {issue.attachmentUrl && (
                    <a href={issue.attachmentUrl.replace('/upload/', '/upload/fl_attachment/')} target="_blank" rel="noopener noreferrer" download className="inline-flex items-center gap-1.5 text-xs font-bold mb-4" style={{ color: '#D4A053' }}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                      Download attachment
                    </a>
                  )}
                  {issue.managerNotes && (
                    <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(82,171,51,0.06)', border: '1px solid rgba(82,171,51,0.12)', color: '#52AB33' }}>
                      <strong>Manager notes:</strong> {issue.managerNotes}
                    </div>
                  )}
                  {editingId === issue._id ? (
                    <div className="space-y-3">
                      <select className="select-dark" value={statusForm.status} onChange={e => setStatusForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="">Select status…</option>
                        {['Pending', 'In Progress', 'Done'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <textarea className="input-dark resize-none" rows={2} placeholder="Manager notes (optional)" value={statusForm.managerNotes} onChange={e => setStatusForm(f => ({ ...f, managerNotes: e.target.value }))} />
                      <div className="flex gap-2">
                        <button onClick={() => setEditingId(null)} className="btn-ghost px-4 py-2 text-xs flex-1">Cancel</button>
                        <button disabled={!!updating || !statusForm.status} onClick={() => handleUpdate(issue._id)} className="btn-fire px-4 py-2 text-xs flex-1">{updating === issue._id ? 'Saving…' : 'Save'}</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingId(issue._id); setStatusForm({ status: issue.status, managerNotes: issue.managerNotes || '' }); }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                      style={{ color: '#D4A053', background: 'rgba(212,160,83,0.08)', border: '1px solid rgba(212,160,83,0.2)' }}>
                      Update Status
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('guides');
  const tabs = [
    { key: 'guides',   label: 'Guides',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { key: 'users',    label: 'Users',    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { key: 'peppers',  label: 'Peppers',  icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg> },
    { key: 'feedback', label: 'Feedback', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
    { key: 'issues',   label: 'Issues',   icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-dark-300">
      <Navbar />
      <div className="relative overflow-hidden py-16 px-6 lg:px-12" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 80%, rgba(194,54,16,0.10), transparent)' }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: '#E84420', background: 'rgba(232,68,32,0.1)', border: '1px solid rgba(232,68,32,0.15)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Administrator
          </div>
          <h1 className="text-4xl font-bold text-cream mb-1 font-display tracking-tight">Admin Dashboard</h1>
          <p className="text-cream-dim text-sm">Manage guides, visitors, and the pepper catalog.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6 pb-20">
        <div className="glass-card p-2 mb-5 w-fit">
          <div className="flex gap-1">
            {tabs.map(({ key, label, icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2.5 ${tab === key ? 'text-white shadow-warm' : 'text-cream-muted hover:text-cream-dim'}`}
                style={tab === key ? { background: 'linear-gradient(135deg, #9A2B0D, #C23610)' } : {}}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link to="/peppers" className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-all">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream-muted">Quick Access</p>
              <p className="text-sm font-bold text-cream mt-1">Open Public Catalog</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-fire-400">
              Open
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
          <Link to="/" className="glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-all">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cream-muted">Quick Access</p>
              <p className="text-sm font-bold text-cream mt-1">View Homepage Experience</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cream-dim">
              Open
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>

        {tab === 'guides'   && <GuidesPanel />}
        {tab === 'users'    && <UsersPanel />}
        {tab === 'peppers'  && <PeppersPanel />}
        {tab === 'feedback' && <FeedbackPanel />}
        {tab === 'issues'   && <IssuesPanel />}
      </div>
    </div>
  );
}
