'use client';
// dashboard/route — role-based router in dev mode (no Clerk needed)
// Uses NEXT_PUBLIC_DEV_ROLE env var to decide which dashboard to show
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const DEV_ROLE = process.env.NEXT_PUBLIC_DEV_ROLE;

const ROUTES: Record<string, string> = {
  STUDENT: '/dashboard/student',
  TRAINER: '/dashboard/trainer',
  INSTITUTION: '/dashboard/institution',
  PROGRAMME_MANAGER: '/dashboard/programme-manager',
  MONITORING_OFFICER: '/dashboard/monitoring-officer',
};

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    const route = async () => {
      try {
        const headers = DEV_ROLE ? { 'X-Dev-Role': DEV_ROLE } : {};
        const me = await axios.get(`${API}/api/users/me`, { headers }).then(r => r.data);
        const dest = ROUTES[me.role];
        router.replace(dest || '/');
      } catch {
        // In dev mode: go to the role dashboard directly from env var
        if (DEV_ROLE && ROUTES[DEV_ROLE]) {
          router.replace(ROUTES[DEV_ROLE]);
        } else {
          router.replace('/');
        }
      }
    };
    route();
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div>
        <div className="spinner" />
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 12 }}>Redirecting...</p>
      </div>
    </div>
  );
}
