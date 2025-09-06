import React from 'react';

interface TaskCardProps {
  text: string;
  time?: string;
  duration?: string;
  tag?: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onEditDue?: () => void;
  dueDate?: string;
  createdAt?: string;
}

const tagColors: Record<string, string> = {
  Today: '#43e97b',
  Tomorrow: '#2563eb',
  Upcoming: '#fbbf24',
};

const TaskCard: React.FC<TaskCardProps> = ({
  text,
  time,
  duration,
  tag,
  completed,
  onToggle,
  onDelete,
  onEditDue,
  dueDate,
  createdAt,
}) => {
  const isOverdue = dueDate && !completed && (() => {
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  })();

  return (
    <div style={{
      background: isOverdue ? '#ffe0e0' : '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(56,89,146,0.08)',
      padding: 18,
      marginBottom: 12,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderLeft: tag ? `6px solid ${tagColors[tag] || '#2563eb'}` : undefined,
      opacity: completed ? 0.6 : 1,
      border: isOverdue ? '2px solid #e53e3e' : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
        <input type="checkbox" checked={completed} onChange={onToggle} style={{ marginRight: 12, accentColor: tag ? tagColors[tag] || '#2563eb' : '#2563eb' }} />
        <span style={{ fontWeight: 600, fontSize: 18, color: completed ? '#888' : '#222', textDecoration: completed ? 'line-through' : 'none' }}>{text}</span>
        {tag && <span style={{ marginLeft: 10, background: tagColors[tag], color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 500 }}>{tag}</span>}
        {isOverdue && (
          <span style={{ marginLeft: 10, background: '#e53e3e', color: '#fff', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>Overdue</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: '#666', gap: 16, justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {time && <span>🕒 {time}</span>}
          {duration && <span>⏱ {duration}</span>}
          {createdAt && <span>Created: {createdAt}</span>}
          {dueDate && <span>Due: {dueDate} <button onClick={onEditDue} style={{ marginLeft: 4, background: 'linear-gradient(90deg,#43e97b,#38f9d7)', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontSize: 12, cursor: 'pointer', fontWeight: 600, boxShadow: '0 2px 8px #43e97b22' }}>Edit</button></span>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Only show the delete button here, not another Edit button */}
          <button onClick={onDelete} style={{
            background: 'linear-gradient(90deg,#e53e3e,#fbbf24)',
            border: 'none',
            borderRadius: '50%',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(229,62,62,0.10)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }} title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="6" width="18" height="14" rx="2" ry="2"/>
              <line x1="9" y1="10" x2="9" y2="16"/>
              <line x1="15" y1="10" x2="15" y2="16"/>
              <line x1="10" y1="2" x2="14" y2="2"/>
              <line x1="12" y1="2" x2="12" y2="6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
