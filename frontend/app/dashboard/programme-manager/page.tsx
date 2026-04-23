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
const navItems = [{ href: '/dashboard/programme-manager', label: 'Dashboard', icon: '🏠' }];

export default function ProgrammeManagerDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${API}/api/programme/summary`, { headers: devHeaders() })
      .then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalBatches = data.reduce((a, d) => a + d.totalBatches, 0);
  const totalStudents = data.reduce((a, d) => a + d.totalStudents, 0);
  const allBatches = data.flatMap(d => d.batches || []);
  const avgRate = allBatches.length > 0
    ? (allBatches.reduce((a, b) => a + b.attendanceRate, 0) / allBatches.length).toFixed(1) : '0';

  return (
    <Sidebar navItems={navItems} role="PROGRAMME_MANAGER">
      <div className="page-header">
        <h1 className="page-title">Programme Manager</h1>
        <p className="page-subtitle">Programme-wide attendance analytics</p>
      </div>

      <div className="stat-grid">
        <StatCard label="Institutions" value={data.length} />
        <StatCard label="Total Batches" value={totalBatches} />
        <StatCard label="Total Students" value={totalStudents} />
        <StatCard label="Avg Attendance" value={`${avgRate}%`} color={Number(avgRate) >= 75 ? '#10b981' : '#f59e0b'} />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>🏫 Institutions</h2>
      {loading ? <div className="spinner" /> : data.length === 0 ? (
        <div className="empty-state"><div className="empty-state-icon">📭</div><div className="empty-state-title">No data yet</div></div>
      ) : data.map((inst: any) => (
        <div key={inst.institutionId} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
               onClick={() => setExpanded(expanded === inst.institutionId ? null : inst.institutionId)}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{inst.institutionName}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{inst.totalBatches} batches · {inst.totalStudents} students</div>
            </div>
            <span>{expanded === inst.institutionId ? '▲' : '▼'}</span>
          </div>
          {expanded === inst.institutionId && inst.batches?.length > 0 && (
            <div style={{ marginTop: 16, borderTop: '1px solid #2a3347', paddingTop: 16 }}>
              {inst.batches.map((b: any) => (
                <div key={b.batchId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1e2536' }}>
                  <span style={{ fontWeight: 500 }}>{b.batchName}</span>
                  <span style={{ fontWeight: 700, color: b.attendanceRate >= 75 ? '#10b981' : '#f59e0b' }}>{b.attendanceRate}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </Sidebar>
  );
}
