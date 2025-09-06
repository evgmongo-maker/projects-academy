import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Tooltip } from 'react-tooltip';
import type { Project } from '../types/project';

const API_URL = 'http://localhost:4000/api/projects';

const sidebarLinks = [
  { label: 'Dashboard', icon: '🏠', href: '/' },
  { label: 'Projects', icon: '📁', href: '/manage-projects' },
  { label: 'Gallery', icon: '🖼️', href: '/portfolio' },
  { label: 'Tasks', icon: '✅', href: '/todo' },
];

const user = {
  name: 'John Doe',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const ProjectManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: '', description: '', image: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch projects
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setProjects)
      .catch(() => setError('Failed to load projects'));
  }, []);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save project');
      const saved = await res.json();
      if (editingId) {
        setProjects(projects.map(p => p.id === editingId ? saved : p));
      } else {
        setProjects([...projects, saved]);
      }
      setForm({ title: '', description: '', image: '' });
      setEditingId(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Edit project
  const handleEdit = (project: Project) => {
    setForm({ title: project.title, description: project.description, image: project.image });
    setEditingId(project.id);
  };

  // Delete project
  const handleDelete = async (id: number) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setProjects(projects.filter(p => p.id !== id));
      if (editingId === id) {
        setForm({ title: '', description: '', image: '' });
        setEditingId(null);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f7fa', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      {/* Minimal Sidebar */}
      <aside style={{
        width: 70,
        background: '#23272f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 0',
        gap: '2.2rem',
        boxShadow: '2px 0 16px rgba(0,0,0,0.10)',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 18,
        borderRight: '1.5px solid #e0eafc',
        position: 'relative',
      }}>
        <img src={user.avatar} alt="avatar" style={{ width: 44, height: 44, borderRadius: '50%', marginBottom: 10, boxShadow: '0 2px 12px #2563eb22' }} />
        {sidebarLinks.map(link => (
          <a key={link.label} href={link.href} style={{ color: '#fff', textDecoration: 'none', fontSize: 26, marginBottom: 18, opacity: 0.96, transition: 'opacity 0.18s, color 0.18s, background 0.18s', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 12, position: 'relative' }}
            onMouseOver={e => (e.currentTarget.style.background = '#2563eb22')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
            data-tooltip-id={`tip-${link.label}`}
          >
            <span style={{ fontSize: 28 }}>{link.icon}</span>
            <Tooltip id={`tip-${link.label}`} place="right" content={link.label} />
          </a>
        ))}
      </aside>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f4f7fa' }}>
        {/* Compact Top Bar */}
        <div style={{ width: '100%', maxWidth: 1200, margin: '2rem auto 0 auto', padding: '1.2rem 2rem', background: '#fff', color: '#23272f', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(102,126,234,0.10)', borderRadius: 18, fontWeight: 700 }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.7rem', letterSpacing: 1, fontFamily: 'Segoe UI, Arial, sans-serif', color: '#2563eb' }}>Projects Manager</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ color: '#444', fontWeight: 600, fontSize: 16 }}>{user.name}</span>
            <a href="/" style={{ background: 'linear-gradient(90deg,#43e97b 0%, #2563eb 100%)', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 12, padding: '0.6rem 1.3rem', fontSize: 16, boxShadow: '0 2px 8px rgba(67,233,123,0.10)', textDecoration: 'none', cursor: 'pointer', letterSpacing: 1, transition: 'background 0.18s' }}
              onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg,#2563eb 0%, #43e97b 100%)')}
              onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg,#43e97b 0%, #2563eb 100%)')}
            >← Home</a>
          </div>
        </div>
        {/* Centered Content Card */}
        <div style={{ width: '100%', maxWidth: 900, margin: '2.5rem auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 18px #2563eb13', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Summary */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>Total Projects: {projects.length}</div>
            <div style={{ fontSize: 16, color: '#444' }}>Last Updated: {projects.length > 0 ? new Date().toLocaleDateString() : '-'}</div>
          </div>
          {/* Divider */}
          <div style={{ width: '100%', height: 1, background: '#e0eafc', margin: '1rem 0 2rem 0' }} />
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600, margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb', marginBottom: 6 }}>{editingId ? 'Edit Project' : 'Add New Project'}</div>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Project Title" required style={{ width: '100%', marginBottom: 10, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #b3c6e6', background: '#f8fafc', fontSize: 16 }} />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Project Description" required style={{ width: '100%', marginBottom: 10, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #b3c6e6', background: '#f8fafc', fontSize: 16, minHeight: 60 }} />
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)" style={{ width: '100%', marginBottom: 10, padding: '12px 14px', borderRadius: 8, border: '1.5px solid #b3c6e6', background: '#f8fafc', fontSize: 16 }} />
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                {editingId ? 'Update Project' : 'Add Project'}
              </Button>
              {editingId && (
                <Button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', image: '' }); }} style={{ flex: 1, background: 'linear-gradient(90deg,#eee,#b3c6e6)', color: '#222' }}>Cancel</Button>
              )}
            </div>
          </form>
          {error && <div style={{ color: '#e53e3e', marginBottom: 10, fontWeight: 600, fontSize: 16, textAlign: 'center' }}>{error}</div>}
          {/* Projects Grid */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: 10 }}>
            {projects.length === 0 && (
              <div style={{ color: '#888', fontSize: 16, textAlign: 'center', gridColumn: '1/-1', marginTop: 18 }}>No projects found. Add a new project above!</div>
            )}
            {projects.map(project => (
              <div key={project.id} style={{ background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #2563eb11', padding: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'box-shadow 0.2s', position: 'relative', minHeight: 180 }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: 10, marginBottom: 10, height: 120, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
                ) : (
                  <div style={{ width: '100%', height: 120, background: 'linear-gradient(90deg,#e0eafc,#43e97b22)', borderRadius: 10, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: 32, fontWeight: 700 }}>📁</div>
                )}
                <div style={{ fontWeight: 700, fontSize: 17, color: '#2563eb', marginBottom: 2, textAlign: 'center' }}>{project.title}</div>
                <div style={{ color: '#444', marginBottom: 6, fontSize: 15, textAlign: 'center', minHeight: 32 }}>{project.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <Button onClick={() => handleEdit(project)} style={{ background: 'linear-gradient(90deg,#2563eb,#43e97b)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 8, padding: '0.3rem 0.8rem' }}>Edit</Button>
                  <Button onClick={() => handleDelete(project.id)} style={{ background: 'linear-gradient(90deg,#e53e3e,#fbbf24)', color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 8, padding: '0.3rem 0.8rem' }}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer style={{ margin: '2rem auto 1rem auto', color: '#2563eb', fontSize: 15, textAlign: 'center', fontWeight: 600, letterSpacing: 1, textShadow: '0 2px 8px #2563eb22' }}>
          &copy; {new Date().getFullYear()} Projects Academy. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default ProjectManager;
