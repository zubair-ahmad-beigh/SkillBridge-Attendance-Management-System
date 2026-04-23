'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SessionCard from '@/components/SessionCard';
import AttendanceTable from '@/components/AttendanceTable';
import StatCard from '@/components/StatCard';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const devHeaders = () => {
  const role = process.env.NEXT_PUBLIC_DEV_ROLE;
  return role ? { 'X-Dev-Role': role } : {};
};

const navItems = [{ href: '/dashboard/student', label: 'Dashboard', icon: '🏠' }];

export default function StudentDashboard() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showBatchJoin, setShowBatchJoin] = useState(false);
  const [inviteToken, setInviteToken] = useState('');
  const [batchId, setBatchId] = useState('');
  const [joining, setJoining] = useState(false);

  const load = async () => {
    try {
      const [s, a] = await Promise.all([
        axios.get(`${API}/api/sessions`, { headers: devHeaders() }).then(r => r.data),
        axios.get(`${API}/api/attendance/me`, { headers: devHeaders() }).then(r => r.data),
      ]);
      setSessions(s);
      setAttendance(a);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleMark = async (sessionId: string, status: string) => {
    setMarking(sessionId);
    try {
      await axios.post(`${API}/api/attendance/mark`, { sessionId, status }, { headers: devHeaders() });
      setMessage('✅ Attendance marked!');
      load();
    } catch (e: any) {
      setMessage('❌ ' + (e?.response?.data?.error || 'Failed'));
    } finally { setMarking(null); }
  };

  const handleJoinBatch = async () => {
    setJoining(true);
    try {
      await axios.post(`${API}/api/batches/${batchId}/join`, { inviteToken }, { headers: devHeaders() });
      setMessage('✅ Joined batch!');
      setShowBatchJoin(false);
      load();
    } catch (e: any) {
      setMessage('❌ ' + (e?.response?.data?.error || 'Failed'));
    } finally { setJoining(false); }
  };

  const present = attendance.filter(a => a.status === 'PRESENT').length;
  const rate = attendance.length > 0 ? Math.round((present / attendance.length) * 100) : 0;

  return (
    <Sidebar navItems={navItems} role="STUDENT">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="page-subtitle">Track your sessions and attendance</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setShowBatchJoin(true)}>🔗 Join Batch</button>
      </div>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'}`}
             onClick={() => setMessage('')} style={{ cursor: 'pointer' }}>{message}</div>
      )}

      <div className="stat-grid">
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard label="Attendance Rate" value={`${rate}%`} color={rate >= 75 ? '#10b981' : '#f59e0b'} />
        <StatCard label="Present" value={present} color="#10b981" />
        <StatCard label="Absent" value={attendance.filter(a => a.status === 'ABSENT').length} color="#ef4444" />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>📅 My Sessions</h2>
      {loading ? <div className="spinner" /> : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No sessions — join a batch first</div>
        </div>
      ) : sessions.map((s: any) => {
        const marked = attendance.find(a => a.sessionId === s.id);
        return (
          <SessionCard key={s.id} title={s.title} date={s.date} startTime={s.startTime}
                       endTime={s.endTime} batchName={s.batchName} trainerName={s.trainerName}
            actions={
              marked ? (
                <span className={`badge badge-${marked.status.toLowerCase()}`}>{marked.status}</span>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  {['PRESENT', 'LATE', 'ABSENT'].map(st => (
                    <button key={st}
                            className={`btn btn-sm ${st === 'PRESENT' ? 'btn-primary' : st === 'ABSENT' ? 'btn-danger' : 'btn-secondary'}`}
                            onClick={() => handleMark(s.id, st)}
                            disabled={marking === s.id}>
                      {marking === s.id ? '...' : st.charAt(0) + st.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              )
            }
          />
        );
      })}

      <h2 style={{ fontSize: 18, fontWeight: 600, margin: '24px 0 16px' }}>📊 My Attendance</h2>
      <AttendanceTable rows={attendance.map((a: any) => ({
        studentName: 'Me', status: a.status, markedAt: a.markedAt,
      }))} />

      {showBatchJoin && (
        <div className="modal-overlay" onClick={() => setShowBatchJoin(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">🔗 Join a Batch</div>
            <div className="form-group">
              <label className="form-label">Batch ID</label>
              <input className="form-input" value={batchId} onChange={e => setBatchId(e.target.value)} placeholder="UUID of the batch" />
            </div>
            <div className="form-group">
              <label className="form-label">Invite Token</label>
              <input className="form-input" value={inviteToken} onChange={e => setInviteToken(e.target.value)} placeholder="Paste invite token" />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowBatchJoin(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleJoinBatch} disabled={joining}>
                {joining ? 'Joining...' : 'Join Batch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}
