import React from 'react';
import { useNavigate } from 'react-router-dom';

const landingBackground = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80';

const projects = [
  {
    id: 1,
    title: 'Weather App',
    description: 'A simple weather forecast app using React and OpenWeatherMap API.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    route: '/weather',
  },
  {
    id: 2,
    title: 'Todo List',
    description: 'A productivity app to manage your daily tasks.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    route: '/todo',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A personal portfolio to showcase your work and skills.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    route: '/portfolio',
  },
  {
    id: 4,
    title: 'Recipe Finder',
    description: 'Find recipes based on ingredients you have at home.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    route: '/recipe',
  },
  {
    id: 5,
    title: 'Expense Tracker',
    description: 'Track your daily expenses and visualize your spending.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    route: '/expense',
  },
  {
    id: 6,
    title: 'Fitness App',
    description: 'Log workouts and monitor your fitness progress.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    route: '/fitness',
  },
];

const glass = {
  background: 'rgba(255,255,255,0.22)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  borderRadius: 18,
  border: '1.5px solid rgba(255,255,255,0.18)',
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(120deg, #e0eafc 0%, #cfdef3 40%, #a1c4fd 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Background image */}
      <img
        src={landingBackground}
        alt="Landing background"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: 0.22,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 40%, #a1c4fd 100%)',
        opacity: 0.7,
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Header */}
      <header style={{
        ...glass,
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 2.5rem 1.2rem 2.5rem',
        color: '#213547',
        borderRadius: 32,
        boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
        marginBottom: 32,
        position: 'relative',
        zIndex: 2,
      }}>
        <h1 style={{ fontWeight: 'bold', fontSize: '2.8rem', letterSpacing: 2, fontFamily: 'serif', color: '#213547', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>
          Welcome to Projects Academy
        </h1>
        <p style={{ fontSize: 22, color: '#444', marginTop: 18, marginBottom: 0, textAlign: 'center', maxWidth: 700 }}>
          Discover, explore, and navigate through a collection of beautiful, modern web projects. Click on any project below to learn more and try it out!
        </p>
      </header>
      {/* Projects Gallery */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.2rem', justifyContent: 'center', maxWidth: 1200, zIndex: 2, position: 'relative' }}>
        {projects.map((project, idx) => (
          <div
            key={project.id}
            style={{
              ...glass,
              width: 320,
              minHeight: 340,
              marginBottom: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'box-shadow 0.3s, transform 0.3s',
              cursor: 'pointer',
              animation: `fadeInUp 0.7s ${0.1 * idx + 0.2}s both`,
            }}
            onClick={() => navigate(project.route)}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 12px 32px 0 rgba(67,233,123,0.22)';
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.035)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = glass.boxShadow!;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: 14, marginBottom: 18, height: 180, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
            <h3 style={{ color: '#222', marginBottom: 8, fontWeight: 600, fontSize: 22, letterSpacing: 0.5 }}>{project.title}</h3>
            <p style={{ minHeight: 60, color: '#444', marginBottom: 12, fontSize: 16, textAlign: 'center', opacity: 0.92 }}>{project.description}</p>
            <button style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: '#222', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(67,233,123,0.10)', transition: 'background 0.2s', marginTop: 8 }}>
              Explore
            </button>
          </div>
        ))}
      </div>
      {/* Keyframes for animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
