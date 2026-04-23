'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import AttendanceTable from '@/components/AttendanceTable';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const devHeaders = () => {
  const role = process.env.NEXT_PUBLIC_DEV_ROLE;
  return role ? { 'X-Dev-Role': role } : {};
};
const navItems = [{ href: '/dashboard/monitoring-officer', label: 'Dashboard', icon: '🏠' }];

export default function MonitoringOfficerDashboard() {
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingSession, setViewingSession] = useState<any>(null);
  const [attData, setAttData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/programme/summary`, { headers: devHeaders() }).then(r => r.data),
      axios.get(`${API}/api/sessions`, { headers: devHeaders() }).then(r => r.data),
    ]).then(([p, s]) => { setProgrammes(p); setSessions(s); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleViewSession = async (session: any) => {
    setViewingSession(session);
    const data = await axios.get(`${API}/api/attendance/session/${session.id}`, { headers: devHeaders() }).then(r => r.data);
    setAttData(data);
  };

  const totalStudents = programmes.reduce((a, p) => a + p.totalStudents, 0);
  const allBatches = programmes.flatMap(p => p.batches || []);
  const avgRate = allBatches.length > 0
    ? (allBatches.reduce((a, b) => a + b.attendanceRate, 0) / allBatches.length).toFixed(1) : '0';

  return (
    <Sidebar navItems={navItems} role="MONITORING_OFFICER">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="page-title">Monitoring Officer</h1>
          <span style={{ padding: '4px 12px', borderRadius: 20, background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: 12, fontWeight: 600 }}>READ ONLY</span>
        </div>
        <p className="page-subtitle">System-wide read-only attendance view</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Institutions" value={programmes.length} />
        <StatCard label="Total Students" value={totalStudents} />
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard label="Avg Attendance" value={`${avgRate}%`} color={Number(avgRate) >= 75 ? '#10b981' : '#f59e0b'} />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📅 All Sessions</h2>
      {loading ? <div className="spinner" /> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Title</th><th>Batch</th><th>Trainer</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.id}>
                  <td><strong>{s.title}</strong></td>
                  <td style={{ color: '#94a3b8' }}>{s.batchName}</td>
                  <td style={{ color: '#94a3b8' }}>{s.trainerName}</td>
                  <td style={{ color: '#94a3b8' }}>{new Date(s.date).toLocaleDateString()}</td>
                  <td><button className="btn btn-ghost btn-sm" onClick={() => handleViewSession(s)}>👁 View</button></td>
                </tr>
              ))}
              {sessions.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No sessions yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {viewingSession && (
        <div className="modal-overlay" onClick={() => setViewingSession(null)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-title">📊 {viewingSession.title}</div>
            <AttendanceTable rows={attData.map((a: any) => ({ studentName: a.studentName, status: a.status, markedAt: a.markedAt }))} />
            <div className="modal-actions"><button className="btn btn-secondary" onClick={() => setViewingSession(null)}>Close</button></div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
