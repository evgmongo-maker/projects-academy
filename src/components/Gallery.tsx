import React from 'react';

export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  dislikes: number;
};

interface GalleryProps {
  projects: Project[];
  topProjects: Project[];
  showAll: boolean;
  handleLike: (id: number) => void;
  handleDislike: (id: number) => void;
  onProjectClick?: (project: Project) => void;
}


const Gallery: React.FC<GalleryProps> = ({
  projects,
  topProjects,
  showAll,
  handleLike,
  handleDislike,
  onProjectClick,
}) => (
  <main style={{ maxWidth: 1200, margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#213547', letterSpacing: 1 }}>{showAll ? 'All Projects' : 'Most Liked Projects'}</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
      {(showAll ? projects : topProjects).map((project) => (
        <div
          key={project.id}
          style={{
            width: 300,
            background: 'rgba(255,255,255,0.98)',
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(67,233,123,0.08)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.2s',
            cursor: onProjectClick ? 'pointer' : 'default',
          }}
          onClick={onProjectClick ? () => onProjectClick(project) : undefined}
        >
          <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: 12, marginBottom: 18, height: 180, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
          <h3 style={{ color: '#222', marginBottom: 8 }}>{project.title}</h3>
          <p style={{ minHeight: 60, color: '#444', marginBottom: 12 }}>{project.description}</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: 10 }}>
            <button onClick={e => { e.stopPropagation(); handleLike(project.id); }} style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: '#222',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.2rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
              transition: 'background 0.2s',
            }}>
              👍 Like ({project.likes})
            </button>
            <button onClick={e => { e.stopPropagation(); handleDislike(project.id); }} style={{
              background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
              color: '#222',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.2rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255,210,0,0.10)',
              transition: 'background 0.2s',
            }}>
              👎 Dislike ({project.dislikes})
            </button>
          </div>
        </div>
      ))}
    </div>
  </main>
);

export default Gallery;
