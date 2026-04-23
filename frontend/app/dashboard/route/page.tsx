'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/api';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const ROUTES: Record<string, string> = {
  STUDENT: '/dashboard/student',
  TRAINER: '/dashboard/trainer',
  INSTITUTION: '/dashboard/institution',
  PROGRAMME_MANAGER: '/dashboard/programme-manager',
  MONITORING_OFFICER: '/dashboard/monitoring-officer',
};

export default function DashboardRouter() {
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const me = await getMe();
        const route = ROUTES[me.role];
        if (route) router.replace(route);
        else router.replace('/onboarding');
      } catch {
        router.replace('/onboarding');
      }
    })();
  }, [getToken, router]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div>
        <div className="spinner" />
        <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: 12 }}>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
