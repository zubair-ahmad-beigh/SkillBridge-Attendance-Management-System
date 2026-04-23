'use client';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { syncUser } from '@/lib/api';

const ROLES = [
  { value: 'STUDENT', label: 'Student', icon: '🎓', desc: 'Mark attendance in your sessions' },
  { value: 'TRAINER', label: 'Trainer', icon: '👨‍🏫', desc: 'Create sessions and track attendance' },
  { value: 'INSTITUTION', label: 'Institution', icon: '🏫', desc: 'View all batches and summaries' },
  { value: 'PROGRAMME_MANAGER', label: 'Programme Manager', icon: '📊', desc: 'Cross-institution oversight' },
  { value: 'MONITORING_OFFICER', label: 'Monitoring Officer', icon: '👁️', desc: 'Read-only monitoring access' },
];

const DASHBOARD_ROUTES: Record<string, string> = {
  STUDENT: '/dashboard/student',
  TRAINER: '/dashboard/trainer',
  INSTITUTION: '/dashboard/institution',
  PROGRAMME_MANAGER: '/dashboard/programme-manager',
  MONITORING_OFFICER: '/dashboard/monitoring-officer',
};

export default function OnboardingPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedRole || !user) return;
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      // Inject token for this request
      if (typeof window !== 'undefined') {
        (window as any).__pending_token = token;
      }

      await syncUser({
        clerkUserId: user.id,
        name: user.fullName || user.username || 'Unknown',
        email: user.emailAddresses[0]?.emailAddress || '',
        role: selectedRole,
        institutionId: institutionId || undefined,
      });

      router.push(DASHBOARD_ROUTES[selectedRole]);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to complete onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Welcome, {user?.firstName}!
          </h1>
          <p style={{ color: '#94a3b8' }}>How will you be using SkillBridge?</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {ROLES.map(role => (
            <div
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              style={{
                padding: 20,
                borderRadius: 12,
                border: `2px solid ${selectedRole === role.value ? '#6366f1' : '#2a3347'}`,
                background: selectedRole === role.value ? 'rgba(99,102,241,0.1)' : '#1e2536',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{role.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{role.label}</div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>{role.desc}</div>
            </div>
          ))}
        </div>

        {(selectedRole === 'INSTITUTION' || selectedRole === 'TRAINER') && (
          <div className="form-group">
            <label className="form-label">Institution ID (optional)</label>
            <input
              className="form-input"
              value={institutionId}
              onChange={e => setInstitutionId(e.target.value)}
              placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
            />
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        <button
          className="btn btn-primary w-full"
          style={{ padding: '14px', fontSize: 16, justifyContent: 'center' }}
          onClick={handleSubmit}
          disabled={!selectedRole || loading}
        >
          {loading ? 'Setting up your account...' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
