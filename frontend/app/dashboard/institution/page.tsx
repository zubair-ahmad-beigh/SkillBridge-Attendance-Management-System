'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const devHeaders = () => {
  const role = process.env.NEXT_PUBLIC_DEV_ROLE;
  return role ? { 'X-Dev-Role': role } : {};
};
const navItems = [{ href: '/dashboard/institution', label: 'Dashboard', icon: '🏠' }];

export default function InstitutionDashboard() {
  const [batches, setBatches] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', institutionId: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const b = await axios.get(`${API}/api/batches`, { headers: devHeaders() }).then(r => r.data);
      setBatches(b);
      const sums = await Promise.all(
        b.map((batch: any) =>
          axios.get(`${API}/api/batches/${batch.id}/summary`, { headers: devHeaders() })
               .then(r => r.data).catch(() => null)
        )
      );
      setSummaries(sums.filter(Boolean));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const totalStudents = summaries.reduce((a, s) => a + (s?.totalStudents || 0), 0);
  const totalSessions = summaries.reduce((a, s) => a + (s?.totalSessions || 0), 0);
  const avgRate = summaries.length > 0
    ? (summaries.reduce((a, s) => a + (s?.attendanceRate || 0), 0) / summaries.length).toFixed(1) : '0';

  const handleCreate = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/api/batches`, form, { headers: devHeaders() });
      setMessage('✅ Batch created!');
      setShowCreate(false);
      setForm({ name: '', institutionId: '' });
      load();
    } catch (e: any) {
      setMessage('❌ ' + (e?.response?.data?.error || 'Failed'));
    } finally { setSaving(false); }
  };

  return (
    <Sidebar navItems={navItems} role="INSTITUTION">
      <div className="page-header flex justify-between items-center">
        <div><h1 className="page-title">Institution Dashboard</h1>
          <p className="page-subtitle">Overview of all batches and attendance</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>＋ New Batch</button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
             onClick={() => setMessage('')} style={{ cursor: 'pointer' }}>{message}</div>
      )}

      <div className="stat-grid">
        <StatCard label="Total Batches" value={batches.length} />
        <StatCard label="Total Students" value={totalStudents} />
        <StatCard label="Total Sessions" value={totalSessions} />
        <StatCard label="Avg Attendance" value={`${avgRate}%`} color={Number(avgRate) >= 75 ? '#10b981' : '#f59e0b'} />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📋 Batch Summaries</h2>
      {loading ? <div className="spinner" /> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Batch</th><th>Sessions</th><th>Students</th><th>Present</th><th>Absent</th><th>Rate</th></tr></thead>
            <tbody>
              {summaries.map((s: any) => (
                <tr key={s.batchId}>
                  <td><strong>{s.batchName}</strong></td>
                  <td>{s.totalSessions}</td><td>{s.totalStudents}</td>
                  <td style={{ color: '#10b981' }}>{s.presentCount}</td>
                  <td style={{ color: '#ef4444' }}>{s.absentCount}</td>
                  <td><span style={{ fontWeight: 700, color: s.attendanceRate >= 75 ? '#10b981' : s.attendanceRate >= 50 ? '#f59e0b' : '#ef4444' }}>{s.attendanceRate}%</span></td>
                </tr>
              ))}
              {summaries.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No batches yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">📋 Create Batch</div>
            <div className="form-group"><label className="form-label">Batch Name</label>
              <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Full-Stack Batch 3" /></div>
            <div className="form-group"><label className="form-label">Institution ID (UUID)</label>
              <input className="form-input" value={form.institutionId} onChange={e => setForm({...form, institutionId: e.target.value})} placeholder="Your institution UUID" /></div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
