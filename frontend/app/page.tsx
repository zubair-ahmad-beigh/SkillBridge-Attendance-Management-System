import Link from 'next/link';

const roles = [
  { role: 'Student', icon: '🎓', href: '/dashboard/student', color: '#60a5fa' },
  { role: 'Trainer', icon: '👨‍🏫', href: '/dashboard/trainer', color: '#a78bfa' },
  { role: 'Institution', icon: '🏫', href: '/dashboard/institution', color: '#34d399' },
  { role: 'Programme Manager', icon: '📊', href: '/dashboard/programme-manager', color: '#fbbf24' },
  { role: 'Monitoring Officer', icon: '👁️', href: '/dashboard/monitoring-officer', color: '#f87171' },
];

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#0f1117', padding: '20px', textAlign: 'center',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🎓</div>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9' }}>SkillBridge</span>
      </div>

      <h1 style={{ fontSize: 40, fontWeight: 800, color: '#f1f5f9', maxWidth: 600, marginBottom: 12, lineHeight: 1.2 }}>
        Attendance Management System
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 16, maxWidth: 500, lineHeight: 1.6, marginBottom: 48 }}>
        Select your role to open the dashboard. No login required in local dev mode.
      </p>

      {/* Role cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, width: '100%', maxWidth: 680 }}>
        {roles.map(item => (
          <Link key={item.role} href={item.href} style={{
            padding: '24px 16px',
            background: '#1e2536',
            border: `1px solid #2a3347`,
            borderRadius: 12,
            textDecoration: 'none',
            display: 'block',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{item.icon}</div>
            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14, marginBottom: 6 }}>{item.role}</div>
            <div style={{ fontSize: 12, color: item.color }}>Open →</div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 40, color: '#374151', fontSize: 12 }}>
        🔧 Local Dev Mode — Backend at localhost:8080
      </p>
    </main>
  );
}
