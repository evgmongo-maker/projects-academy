import React from 'react';

interface User {
  username: string;
  email?: string;
}

interface TopNavProps {
  showAll: boolean;
  setShowAll: (show: boolean) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  setHoveredIndex: (idx: number | null) => void;
  getDropdownItemStyle: (idx: number) => React.CSSProperties;
  handleContactNavClick: (e: React.MouseEvent) => void;
  onLogout: () => void;
  loggedInUser?: User | null;
}

const TopNav: React.FC<TopNavProps> = ({
  showAll,
  setShowAll,
  dropdownOpen,
  setDropdownOpen,
  setHoveredIndex,
  getDropdownItemStyle,
  handleContactNavClick,
  onLogout,
  loggedInUser,
}) => (
  <nav style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2.5rem',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    marginBottom: '2rem',
    boxShadow: '0 4px 16px rgba(102,126,234,0.10)',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 16,
    transition: 'border-radius 0.3s',
  }}>
    <div style={{ fontWeight: 'bold', fontSize: '1.6rem', letterSpacing: 1.5, fontFamily: 'serif', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>Project Academy</div>
    <div style={{ display: 'flex', gap: '2.2rem', alignItems: 'center' }}>
      {[
        { label: 'Home', href: '#' },
        { label: 'Users', href: '#' },
        { label: 'Services', href: '#' },
        { label: 'Contact', href: '#contact' },
        { label: 'Manage Projects', href: '/manage-projects' },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.13rem',
            padding: '0.45rem 1.2rem',
            borderRadius: 8,
            position: 'relative',
            transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
            overflow: 'hidden',
            cursor: 'pointer',
            display: 'inline-block',
            boxShadow: '0 2px 8px rgba(102,126,234,0.08)',
            background: 'rgba(255,255,255,0.04)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.18)';
            (e.currentTarget as HTMLElement).style.color = '#667eea';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(102,126,234,0.18)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLElement).style.color = '#fff';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(102,126,234,0.08)';
          }}
          onClick={item.label === 'Contact' ? handleContactNavClick : undefined}
        >
          {item.label}
          <span
            style={{
              display: 'block',
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              height: 2,
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
              transform: 'scaleX(0)',
              transition: 'transform 0.25s',
            }}
            className="nav-underline"
          ></span>
        </a>
      ))}
      <button
        onClick={() => setShowAll(!showAll)}
        style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.5rem 1.2rem',
          fontWeight: 600,
          fontSize: '1.13rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
          marginLeft: 12,
          transition: 'background 0.18s',
        }}
      >{showAll ? 'Show Top' : 'Show All'}</button>
      <div style={{ position: 'relative' }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.2rem',
            fontWeight: 600,
            fontSize: '1.13rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(102,126,234,0.10)',
            marginLeft: 12,
            transition: 'background 0.18s',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }} role="img" aria-label="user">👤</span>
          {loggedInUser ? loggedInUser.username : 'Sign In'}
        </button>
        {dropdownOpen && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(102,126,234,0.18)',
            minWidth: 160,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            padding: '0.5rem 0',
          }}>
            <button
              style={getDropdownItemStyle(0)}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => alert('Sign In clicked')}
            >Sign In</button>
            <button
              style={getDropdownItemStyle(1)}
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => alert('Register clicked')}
            >Register</button>
            <button
              style={getDropdownItemStyle(2)}
              onMouseEnter={() => setHoveredIndex(2)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => alert('Profile clicked')}
            >Profile</button>
            <button
              style={getDropdownItemStyle(3)}
              onMouseEnter={() => setHoveredIndex(3)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={onLogout}
            >Log Out</button>
          </div>
        )}
      </div>
    </div>
  </nav>
);

export default TopNav;
