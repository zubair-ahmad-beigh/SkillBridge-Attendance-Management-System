'use client';
// onboarding — dev mode version without Clerk hooks
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEV_ROLE = process.env.NEXT_PUBLIC_DEV_ROLE;

const ROLES = [
  { value: 'STUDENT',            label: 'Student',            icon: '🎓', desc: 'Mark attendance in your sessions' },
  { value: 'TRAINER',            label: 'Trainer',            icon: '👨‍🏫', desc: 'Create sessions and track attendance' },
  { value: 'INSTITUTION',        label: 'Institution',        icon: '🏫', desc: 'View all batches and summaries' },
  { value: 'PROGRAMME_MANAGER',  label: 'Programme Manager',  icon: '📊', desc: 'Cross-institution oversight' },
  { value: 'MONITORING_OFFICER', label: 'Monitoring Officer', icon: '👁️', desc: 'Read-only monitoring access' },
];

const DASHBOARD_ROUTES: Record<string, string> = {
  STUDENT:            '/dashboard/student',
  TRAINER:            '/dashboard/trainer',
  INSTITUTION:        '/dashboard/institution',
  PROGRAMME_MANAGER:  '/dashboard/programme-manager',
  MONITORING_OFFICER: '/dashboard/monitoring-officer',
};

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(DEV_ROLE || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setLoading(true);
    setError('');
    try {
      const headers = DEV_ROLE ? { 'X-Dev-Role': DEV_ROLE } : {};
      await axios.post(`${API}/api/users/sync`, {
        clerkUserId: `dev-user-${Date.now()}`,
        name: name || 'Dev User',
        email: email || 'dev@skillbridge.local',
        role: selectedRole,
        institutionId: institutionId || undefined,
      }, { headers });
      router.push(DASHBOARD_ROUTES[selectedRole]);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome to SkillBridge!</h1>
          <p style={{ color: '#94a3b8' }}>Select your role to get started</p>
        </div>

        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {ROLES.map(role => (
            <div key={role.value} onClick={() => setSelectedRole(role.value)}
                 style={{ padding: 20, borderRadius: 12, border: `2px solid ${selectedRole === role.value ? '#6366f1' : '#2a3347'}`,
                          background: selectedRole === role.value ? 'rgba(99,102,241,0.1)' : '#1e2536', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{role.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{role.label}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{role.desc}</div>
            </div>
          ))}
        </div>

        {(selectedRole === 'INSTITUTION' || selectedRole === 'TRAINER') && (
          <div className="form-group">
            <label className="form-label">Institution ID (optional)</label>
            <input className="form-input" value={institutionId} onChange={e => setInstitutionId(e.target.value)} placeholder="UUID" />
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 16, justifyContent: 'center' }}
                onClick={handleSubmit} disabled={!selectedRole || loading}>
          {loading ? 'Setting up...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
