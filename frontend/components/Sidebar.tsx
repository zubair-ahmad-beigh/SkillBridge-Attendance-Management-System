'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  navItems: NavItem[];
  role: string;
  children?: ReactNode;
}

export default function Sidebar({ navItems, role, children }: SidebarProps) {
  const pathname = usePathname();

  const roleColors: Record<string, string> = {
    STUDENT: '#60a5fa',
    TRAINER: '#a78bfa',
    INSTITUTION: '#34d399',
    PROGRAMME_MANAGER: '#fbbf24',
    MONITORING_OFFICER: '#f87171',
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <span className="sidebar-logo-text">SkillBridge</span>
        </div>

        {/* Role badge */}
        <div style={{
          padding: '6px 12px',
          borderRadius: 20,
          background: `${roleColors[role] || '#6366f1'}20`,
          color: roleColors[role] || '#6366f1',
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          {role.replace(/_/g, ' ')}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}

          <Link href="/" className="nav-item" style={{ marginTop: 8 }}>
            <span style={{ fontSize: 16 }}>🏠</span>
            <span>Home</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div style={{ padding: '8px 4px', color: '#64748b', fontSize: 12 }}>
            🔧 Dev Mode — No Auth
          </div>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}
