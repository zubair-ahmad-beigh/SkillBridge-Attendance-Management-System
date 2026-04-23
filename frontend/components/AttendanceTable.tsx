interface AttendanceRow {
  studentName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  markedAt?: string;
}

interface AttendanceTableProps {
  rows: AttendanceRow[];
  sessionTitle?: string;
}

export default function AttendanceTable({ rows, sessionTitle }: AttendanceTableProps) {
  const statusClass = { PRESENT: 'badge-present', ABSENT: 'badge-absent', LATE: 'badge-late' };
  const statusIcon = { PRESENT: '✅', ABSENT: '❌', LATE: '⏰' };

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <div className="empty-state-title">No attendance records yet</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Status</th>
            <th>Marked At</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={{ color: '#64748b' }}>{i + 1}</td>
              <td><strong>{row.studentName}</strong></td>
              <td>
                <span className={`badge ${statusClass[row.status]}`}>
                  {statusIcon[row.status]} {row.status}
                </span>
              </td>
              <td style={{ color: '#64748b', fontSize: 13 }}>
                {row.markedAt ? new Date(row.markedAt).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
