'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SessionCard from '@/components/SessionCard';
import StatCard from '@/components/StatCard';
import AttendanceTable from '@/components/AttendanceTable';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const devHeaders = () => {
  const role = process.env.NEXT_PUBLIC_DEV_ROLE;
  return role ? { 'X-Dev-Role': role } : {};
};
const navItems = [{ href: '/dashboard/trainer', label: 'Dashboard', icon: '🏠' }];

export default function TrainerDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAttendance, setShowAttendance] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ batchId: '', title: '', date: '', startTime: '', endTime: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [s, b] = await Promise.all([
        axios.get(`${API}/api/sessions`, { headers: devHeaders() }).then(r => r.data),
        axios.get(`${API}/api/batches`, { headers: devHeaders() }).then(r => r.data),
      ]);
      setSessions(s); setBatches(b);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/sessions`, form, { headers: devHeaders() });
      setMessage('✅ Session created!');
      setShowCreate(false);
      setForm({ batchId: '', title: '', date: '', startTime: '', endTime: '' });
      load();
    } catch (e: any) {
      setMessage('❌ ' + (e?.response?.data?.error || 'Failed'));
    } finally { setSaving(false); }
  };

  const handleViewAttendance = async (session: any) => {
    setShowAttendance(session);
    const data = await axios.get(`${API}/api/attendance/session/${session.id}`, { headers: devHeaders() }).then(r => r.data);
    setAttendanceData(data);
  };

  const handleGenerateInvite = async (batchId: string) => {
    const result = await axios.post(`${API}/api/batches/${batchId}/invite`, {}, { headers: devHeaders() }).then(r => r.data);
    setMessage(`✅ Invite Token: ${result.inviteToken}`);
  };

  return (
    <Sidebar navItems={navItems} role="TRAINER">
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Trainer Dashboard</h1>
          <p className="page-subtitle">Manage sessions and track attendance</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>＋ Create Session</button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
             onClick={() => setMessage('')} style={{ cursor: 'pointer', wordBreak: 'break-all' }}>{message}</div>
      )}

      <div className="stat-grid">
        <StatCard label="My Sessions" value={sessions.length} />
        <StatCard label="My Batches" value={batches.length} />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📋 My Batches</h2>
      {batches.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No batches yet</div></div>
      ) : batches.map((b: any) => (
        <div key={b.id} className="card" style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontWeight: 600 }}>{b.name}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{b.institutionName}</div></div>
          <button className="btn btn-secondary btn-sm" onClick={() => handleGenerateInvite(b.id)}>🔗 Invite Link</button>
        </div>
      ))}

      <h2 style={{ fontSize: 18, fontWeight: 600, margin: '24px 0 16px' }}>📅 Sessions</h2>
      {loading ? <div className="spinner" /> : sessions.map((s: any) => (
        <SessionCard key={s.id} title={s.title} date={s.date} startTime={s.startTime}
                     endTime={s.endTime} batchName={s.batchName}
          actions={<button className="btn btn-secondary btn-sm" onClick={() => handleViewAttendance(s)}>👁 Attendance</button>}
        />
      ))}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">📅 Create Session</div>
            <div className="form-group"><label className="form-label">Batch</label>
              <select className="form-select" value={form.batchId} onChange={e => setForm({...form, batchId: e.target.value})}>
                <option value="">Select batch...</option>
                {batches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select></div>
            <div className="form-group"><label className="form-label">Title</label>
              <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Intro to React" /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">Start</label>
                <input className="form-input" type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} /></div>
              <div className="form-group"><label className="form-label">End</label>
                <input className="form-input" type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}

      {showAttendance && (
        <div className="modal-overlay" onClick={() => setShowAttendance(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">📊 {showAttendance.title}</div>
            <AttendanceTable rows={attendanceData.map((a: any) => ({ studentName: a.studentName, status: a.status, markedAt: a.markedAt }))} />
            <div className="modal-actions"><button className="btn btn-secondary" onClick={() => setShowAttendance(null)}>Close</button></div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
