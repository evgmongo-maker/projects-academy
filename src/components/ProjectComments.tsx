import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  projectId: number;
  text: string;
  author: string;
  createdAt: string;
}

interface ProjectCommentsProps {
  projectId: number;
  currentUser: string;
}

const API_URL = 'http://localhost:4000/api';

const ProjectComments: React.FC<ProjectCommentsProps> = ({ projectId, currentUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch comments
  useEffect(() => {
    fetch(`${API_URL}/projects/${projectId}/comments`)
      .then(res => res.json())
      .then(setComments)
      .catch(() => setError('Failed to load comments'));
  }, [projectId]);

  // Add or update comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/comments/${editingId}` : `${API_URL}/projects/${projectId}/comments`;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Failed to save comment');
      const saved = await res.json();
      if (editingId) {
        setComments(comments.map(c => c.id === editingId ? saved : c));
      } else {
        setComments([...comments, saved]);
      }
      setText('');
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Edit comment
  const handleEdit = (comment: Comment) => {
    setText(comment.text);
    setEditingId(comment.id);
  };

  // Delete comment
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete comment');
      setComments(comments.filter(c => c.id !== id));
      if (editingId === id) {
        setText('');
        setEditingId(null);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32, background: '#f8fafc', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px rgba(56,89,146,0.04)' }}>
      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Comments</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Add a comment..." required style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 8, border: '1px solid #ccc', minHeight: 40 }} />
        <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
          {editingId ? 'Update Comment' : 'Add Comment'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setText(''); }} style={{ marginLeft: 12, background: '#eee', color: '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Cancel</button>
        )}
      </form>
      {error && <div style={{ color: '#e53e3e', marginBottom: 12 }}>{error}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(comment => (
          <li key={comment.id} style={{ marginBottom: 14, padding: 10, borderRadius: 8, background: '#fff', boxShadow: '0 1px 4px rgba(56,89,146,0.03)' }}>
            <div style={{ fontWeight: 600 }}>{comment.author}</div>
            <div style={{ color: '#444', marginBottom: 4 }}>{comment.text}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{new Date(comment.createdAt).toLocaleString()}</div>
            {comment.author === currentUser && (
              <>
                <button onClick={() => handleEdit(comment)} style={{ marginRight: 8, background: '#43e97b', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                <button onClick={() => handleDelete(comment.id)} style={{ background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectComments;
