import React from 'react';

// Example content for left and right sidebars
export const leftSidebarContent = [
  { icon: '🏠', label: 'Home', link: '/' },
  { icon: '💼', label: 'Projects', link: '/portfolio' },
  { icon: '📧', label: 'Contact', link: '#contact' },
];

export const rightSidebarContent = [
  { icon: '🔗', label: 'GitHub', link: 'https://github.com/' },
  { icon: '📝', label: 'Blog', link: 'https://dev.to/' },
  { icon: '📄', label: 'Resume', link: '#' },
];

interface PortfolioSidebarProps {
  position: 'left' | 'right';
  content: { icon: string; label: string; link: string }[];
}

const PortfolioSidebar: React.FC<PortfolioSidebarProps> = ({ position, content }) => (
  <aside
    style={{
      width: 70,
      background: 'rgba(34,34,34,0.92)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 0',
      gap: '1.5rem',
      boxShadow: position === 'left' ? '2px 0 8px rgba(0,0,0,0.05)' : '-2px 0 8px rgba(0,0,0,0.05)',
      borderTopRightRadius: position === 'left' ? 24 : 0,
      borderBottomRightRadius: position === 'left' ? 16 : 0,
      borderTopLeftRadius: position === 'right' ? 24 : 0,
      borderBottomLeftRadius: position === 'right' ? 16 : 0,
      position: 'fixed',
      top: 0,
      [position]: 0,
      height: '100vh',
      zIndex: 10,
    }}
  >
    {content.map((item, idx) => (
      <a
        key={idx}
        href={item.link}
        target={item.link.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#fff',
          textDecoration: 'none',
          fontSize: 22,
          marginBottom: 18,
          opacity: 0.85,
          transition: 'opacity 0.18s, color 0.18s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
      >
        <span>{item.icon}</span>
        <span style={{ fontSize: 13, marginTop: 2 }}>{item.label}</span>
      </a>
    ))}
  </aside>
);

export default PortfolioSidebar;
