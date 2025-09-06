import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string | null;
}

const TodoApp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [addError, setAddError] = useState('');
  // Helper to set date for column
  const setDateForColumn = (col: string) => {
    const now = new Date();
    if (col === 'Today') {
      setDueDate(now.toISOString().slice(0, 10));
    } else if (col === 'Tomorrow') {
      const tomorrow = new Date(now.getTime() + 86400000);
      setDueDate(tomorrow.toISOString().slice(0, 10));
    } else {
      setDueDate(''); // Upcoming: let user pick any date
    }
    setDueTime('');
    document.getElementById('task-input')?.focus();
  };
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [editDueId, setEditDueId] = useState<number | null>(null);
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not logged in. Please log in to see your tasks.');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetch('http://localhost:4000/api/todos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (res.status === 403) {
          setError('Invalid or expired token.');
          setTimeout(() => navigate('/login'), 1500);
          return [];
        }
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Failed to load todos');
        }
        return res.json();
      })
      .then(setTodos)
      .catch((err) => {
        setError(err.message || 'Failed to load todos');
        if (err.message && (err.message.includes('token') || err.message.includes('expired'))) {
          setTimeout(() => navigate('/login'), 1500);
        }
      });
  }, [navigate]);

  // Add todo
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!input.trim()) {
      setAddError('Task name cannot be empty.');
      return;
    }
    let dueDateTime = dueDate;
    if (dueDate && dueTime) {
      dueDateTime = `${dueDate}T${dueTime}`;
    }
    if (dueDateTime) {
      const now = new Date();
      const due = new Date(dueDateTime);
      if (due < now) {
        setAddError('Due date/time cannot be in the past.');
        return;
      }
    }
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:4000/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: input, dueDate: dueDateTime }),
    });
    if (!res.ok) return;
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setInput('');
    setDueDate('');
    setDueTime('');
  };

  // Edit due date and time
  const handleEditDue = (id: number, value: string) => {
    setEditDueId(id);
    if (value) {
      const [date, time] = value.split('T');
      setEditDueDate(date || '');
      setEditDueTime(time || '');
    } else {
      setEditDueDate('');
      setEditDueTime('');
    }
  };
  const handleSaveDue = async (id: number) => {
    const token = localStorage.getItem('token');
    let dueDateTime = editDueDate;
    if (editDueDate && editDueTime) {
      dueDateTime = `${editDueDate}T${editDueTime}`;
    }
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dueDate: dueDateTime }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
    setEditDueId(null);
    setEditDueDate('');
    setEditDueTime('');
  };

  // Toggle todo
  const handleToggle = async (id: number) => {
    const token = localStorage.getItem('token');
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  // Delete todo
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4000/api/todos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    setTodos(todos.filter(t => t.id !== id));
  };

  // Group todos
  const grouped: Record<string, Todo[]> = { Today: [], Tomorrow: [], Upcoming: [] };
  const columns = ['Today', 'Tomorrow', 'Upcoming'];
  todos.forEach(todo => {
    if (!todo.dueDate) {
      grouped.Upcoming.push(todo);
      return;
    }
    const due = new Date(todo.dueDate);
    const now = new Date();
    if (due.toDateString() === now.toDateString()) grouped.Today.push(todo);
    else if (due.toDateString() === new Date(now.getTime() + 86400000).toDateString()) grouped.Tomorrow.push(todo);
    else grouped.Upcoming.push(todo);
  });

  React.useEffect(() => {
    if (!addError) return;
    const handleClick = () => setAddError('');
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [addError]);

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto', padding: 0, background: 'linear-gradient(135deg, #e0eafc 0%, #43e97b22 100%)', borderRadius: 24, boxShadow: '0 4px 24px #2563eb22', minHeight: '80vh', position: 'relative' }}>
      {error && (
        <div style={{ background: '#ffe0e0', color: '#e53e3e', padding: '18px', borderRadius: 12, margin: '32px', fontWeight: 600, fontSize: 20, textAlign: 'center', boxShadow: '0 2px 8px #e53e3e22' }}>
          {error}
        </div>
      )}
      {/* Top Navigation Bar */}
      <div style={{
        width: '100%',
        padding: '0 0 0 0',
        background: 'linear-gradient(90deg,#43e97b,#38f9d7)',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        boxShadow: '0 2px 12px #2563eb22',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64,
      }}>
        <Button style={{ marginLeft: 32, marginTop: 0 }} onClick={() => window.location.href = '/'}>
          ← Home
        </Button>
        <span style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginRight: 32, letterSpacing: 2, textShadow: '0 2px 8px #43e97b55' }}>Tasks Scheduling</span>
      </div>
      <div style={{ padding: '32px 32px 0 32px' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color: '#2563eb', textShadow: '0 2px 8px #2563eb22' }}>Organize your tasks</h2>
        <p style={{ color: '#444', fontSize: 20, marginBottom: 18, textShadow: '0 2px 8px #2563eb11' }}>Plan your day, tomorrow, and upcoming tasks. Add, check off, and manage your schedule below.</p>
      </div>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 14, marginBottom: 28, alignItems: 'center', flexWrap: 'wrap', background: 'linear-gradient(90deg,#f8fafc,#e0eafc)', borderRadius: 12, padding: '18px 18px 10px 18px', boxShadow: '0 2px 12px #2563eb11', position: 'relative', zIndex: 2 }}>
        <input id="task-input" value={input} onChange={e => setInput(e.target.value)} placeholder="Add a new task..." style={{ flex: 1, fontSize: 18, padding: '10px 14px', borderRadius: 8, border: '1px solid #b3c6e6', background: '#fff' }} />
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ fontSize: 16, padding: '8px 10px', borderRadius: 8, border: '1px solid #b3c6e6', background: '#fff' }} />
        <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} style={{ fontSize: 16, padding: '8px 10px', borderRadius: 8, border: '1px solid #b3c6e6', background: '#fff' }} />
        <div style={{ position: 'relative', display: 'inline-block', zIndex: 10 }}>
          <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #43e97b 100%)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.4rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(67,233,123,0.10)', transition: 'background 0.2s' }}>Add</button>
          {addError && (
            <span style={{
              position: 'absolute',
              left: '50%',
              top: '110%',
              transform: 'translateX(-50%)',
              background: 'rgba(20,20,20,0.85)',
              color: '#fff',
              padding: '14px 20px 12px 20px',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 500,
              boxShadow: '0 2px 16px rgba(0,0,0,0.22)',
              whiteSpace: 'nowrap',
              zIndex: 100,
              marginTop: 8,
              pointerEvents: 'auto',
              border: '1.5px solid #222',
              letterSpacing: 0.5,
              minWidth: 220,
              textAlign: 'left',
            }}>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4, textAlign: 'left' }}>Invalid input.</div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.18)', margin: '0 0 8px 0' }} />
              <div style={{ fontWeight: 500, fontSize: 16 }}>{addError}</div>
            </span>
          )}
        </div>
      </form>
      <div style={{ display: 'flex', gap: 0, marginTop: 10, alignItems: 'stretch', justifyContent: 'center', minHeight: 400 }}>
        {columns.map((col, idx) => (
          <React.Fragment key={col}>
            <div style={{
              flex: 1,
              minWidth: 320,
              padding: '0 16px',
              display: 'flex',
              flexDirection: 'column',
              background: col === 'Today' ? 'linear-gradient(135deg, #e0f7ef 0%, #43e97b22 100%)'
                : col === 'Tomorrow' ? 'linear-gradient(135deg, #e0eafc 0%, #2563eb22 100%)'
                : 'linear-gradient(135deg, #fffbe6 0%, #fbbf2422 100%)',
              borderRadius: 18,
              boxShadow: '0 2px 12px #2563eb11',
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: col === 'Today' ? '#43e97b' : col === 'Tomorrow' ? '#2563eb' : '#fbbf24', letterSpacing: 1 }}>{col} {col === 'Today' ? '💪' : col === 'Tomorrow' ? '🎉' : ''}</h3>
                <button onClick={() => setDateForColumn(col)} style={{ background: 'linear-gradient(90deg,#43e97b,#38f9d7)', color: '#fff', border: 'none', borderRadius: 8, padding: '0.3rem 1.1rem', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #43e97b22', marginLeft: 8 }}>+ Add Task</button>
              </div>
              {grouped[col].length === 0 && <div style={{ color: '#888', textAlign: 'center', marginTop: 18 }}>No tasks</div>}
              {grouped[col].map((todo: Todo) => (
                <div key={todo.id}>
                  {editDueId === todo.id ? (
                    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)} style={{ fontSize: 13, padding: '2px 6px', borderRadius: 6, border: '1px solid #ccc' }} />
                      <input type="time" value={editDueTime} onChange={e => setEditDueTime(e.target.value)} style={{ fontSize: 13, padding: '2px 6px', borderRadius: 6, border: '1px solid #ccc' }} />
                      <button onClick={() => handleSaveDue(todo.id)} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '0.2rem 0.7rem', fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22' }}>Save</button>
                      <button onClick={() => setEditDueId(null)} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '0.2rem 0.7rem', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginLeft: 4, boxShadow: '0 2px 8px #2222' }}>Cancel</button>
                    </div>
                  ) : (
                    <TaskCard
                      text={todo.text}
                      completed={todo.completed}
                      onToggle={() => handleToggle(todo.id)}
                      onDelete={() => handleDelete(todo.id)}
                      onEditDue={() => handleEditDue(todo.id, todo.dueDate || '')}
                      dueDate={todo.dueDate ? new Date(todo.dueDate).toLocaleString() : undefined}
                      createdAt={todo.createdAt ? new Date(todo.createdAt).toLocaleString() : undefined}
                      tag={col}
                    />
                  )}
                </div>
              ))}
            </div>
            {idx < columns.length - 1 && (
              <div style={{ width: 4, background: '#b3c6e6', height: 'auto', minHeight: 400, margin: '0 8px', borderRadius: 2, alignSelf: 'stretch', boxShadow: '0 0 2px #b3c6e6' }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <hr style={{ margin: '32px 0 16px 0', border: 'none', borderTop: '2px solid #2563eb22' }} />
      <div style={{ marginTop: 16, textAlign: 'center', color: '#2563eb', fontWeight: 500, fontSize: 17, textShadow: '0 2px 8px #2563eb22' }}>
        <span role="img" aria-label="tip">💡</span> Tip: Click the checkbox to mark a task as done!
      </div>
      <footer style={{ marginTop: 40, color: '#2563eb', fontSize: 16, textAlign: 'center', fontWeight: 600, letterSpacing: 1, textShadow: '0 2px 8px #2563eb22' }}>
        &copy; {new Date().getFullYear()} Projects Academy. All rights reserved.
      </footer>
    </div>
  );
};

export default TodoApp;
