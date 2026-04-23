import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillBridge — Attendance Management',
  description: 'Track attendance across batches, sessions, and institutions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
