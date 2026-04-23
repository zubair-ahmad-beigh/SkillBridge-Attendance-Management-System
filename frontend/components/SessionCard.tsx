import type { ReactNode } from 'react';

interface SessionCardProps {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  batchName: string;
  trainerName?: string;
  actions?: ReactNode;
}

export default function SessionCard({
  title, date, startTime, endTime, batchName, trainerName, actions
}: SessionCardProps) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>{title}</div>
          <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontSize: 13 }}>
            <span>📅 {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            <span>🕐 {startTime} – {endTime}</span>
            <span>📋 {batchName}</span>
            {trainerName && <span>👨‍🏫 {trainerName}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {actions}
        </div>
      </div>
    </div>
  );
}
