import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Gallery from './components/Gallery';
import Login from './components/Login';

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  likes: number;
  dislikes: number;
};

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Weather App',
    description: 'A simple weather forecast app using React and OpenWeatherMap API.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
  {
    id: 2,
    title: 'Todo List',
    description: 'A productivity app to manage your daily tasks.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A personal portfolio to showcase your work and skills.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
  {
    id: 4,
    title: 'Recipe Finder',
    description: 'Find recipes based on ingredients you have at home.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
  {
    id: 5,
    title: 'Expense Tracker',
    description: 'Track your daily expenses and visualize your spending.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
  {
    id: 6,
    title: 'Fitness App',
    description: 'Log workouts and monitor your fitness progress.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80',
    likes: 0,
    dislikes: 0,
  },
];

type User = {
  username: string;
  password: string;
  email?: string;
};

function App() {
  const [wiggleBtn, setWiggleBtn] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  // Login logic
  const handleLogin = (user: User) => {
    setLoggedInUser(user);
  };

  // Auto-login if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !loggedInUser) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.username) {
          setLoggedInUser({ username: payload.username, email: payload.email || '', password: '' });
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, [loggedInUser]);
  const [uploadPopup, setUploadPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const [uploadPopupVisible, setUploadPopupVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Hey, how are you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAll, setShowAll] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  // Upload logic
  const handleUploadClick = () => {
    setUploadPopup(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadPopup(true);
      setUploadPopupVisible(true);
      setTimeout(() => setUploadPopupVisible(false), 2500);
    }
  };

  // Chat logic
  const handleChatSend = () => {
    if (chatInput.trim() === '') return;
    setChatMessages((msgs) => [
      ...msgs,
      { from: 'user', text: chatInput }
    ]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: "I'm just a bot, but I'm here to help!" }
      ]);
    }, 800);
  };

  // Dropdown style
  const dropdownItemStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '0.75rem 1.25rem',
    fontSize: '1rem',
    color: '#222',
    cursor: 'pointer',
    borderRadius: 0,
    transition: 'background 0.2s',
    outline: 'none',
    width: '100%',
    fontWeight: 500,
    margin: 0,
    boxSizing: 'border-box',
  };
  const getDropdownItemStyle = (idx: number) => ({
    ...dropdownItemStyle,
    background: hoveredIndex === idx ? '#f3f4f6' : 'none',
  });

  // Logout logic
  const handleLogout = () => {
    setLoggedInUser(null);
    setDropdownOpen(false);
    localStorage.removeItem('token');
  };

  // Project like/dislike
  const handleLike = (id: number) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, likes: proj.likes + 1 } : proj
      )
    );
  };
  const handleDislike = (id: number) => {
    setProjects((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, dislikes: proj.dislikes + 1 } : proj
      )
    );
  };

  // Top projects
  const sortedByLikes = [...projects].sort((a, b) => b.likes - a.likes);
  const topProjects = sortedByLikes.slice(0, 4);

  // Scroll to contact
  const handleContactNavClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!loggedInUser) {
    return (
      <Login
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    }}>
      {/* Sidebar */}
      <Sidebar
        wiggleBtn={wiggleBtn}
        setWiggleBtn={setWiggleBtn}
        handleUploadClick={handleUploadClick}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        uploadPopup={uploadPopup}
        uploadedFile={uploadedFile}
        uploadPopupVisible={uploadPopupVisible}
        setChatOpen={setChatOpen}
        setDropdownOpen={setDropdownOpen}
      />
      {/* Main content area */}
      <div style={{ flex: 1 }}>
        {/* Top Navigation Bar */}
        <TopNav
          showAll={showAll}
          setShowAll={setShowAll}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          setHoveredIndex={setHoveredIndex}
          getDropdownItemStyle={getDropdownItemStyle}
          handleContactNavClick={handleContactNavClick}
          onLogout={handleLogout}
          loggedInUser={loggedInUser}
        />
        {/* Gallery Section */}
        <Gallery
          projects={projects}
          topProjects={topProjects}
          showAll={showAll}
          handleLike={handleLike}
          handleDislike={handleDislike}
        />
        {/* Contact section at the bottom */}
        <div ref={contactRef} id="contact" style={{
          margin: '64px auto 0 auto',
          maxWidth: 480,
          padding: '32px 24px',
          borderRadius: 24,
          background: 'linear-gradient(120deg, #e0e7ef 0%, #f8fafc 100%)',
          boxShadow: '0 4px 24px rgba(56, 89, 146, 0.08)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#2d3748', letterSpacing: 0.5 }}>Contact Us</h2>
          <p style={{ fontSize: 18, color: '#4a5568', marginBottom: 16 }}>
            We'd love to hear from you! Reach out via any of the methods below:
          </p>
          <div style={{ fontSize: 16, color: '#2d3748', lineHeight: 1.7 }}>
            <div><strong>Email:</strong> <a href="mailto:contact@example.com" style={{ color: '#3182ce', textDecoration: 'underline' }}>contact@example.com</a></div>
            <div><strong>Phone:</strong> <a href="tel:+1234567890" style={{ color: '#3182ce', textDecoration: 'underline' }}>+1 (234) 567-890</a></div>
            <div><strong>Address:</strong> 123 Main St, City, Country</div>
          </div>
        </div>
        {/* Chat Popup */}
        {chatOpen && (
          <div
            style={{
              position: 'fixed',
              bottom: 40,
              left: 120,
              width: 320,
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: '#f7971e', color: '#fff', padding: '0.75rem 1rem', fontWeight: 600, fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Chat Bot
              <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ flex: 1, padding: '1rem', background: '#f9fafb', minHeight: 120, maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    alignSelf: msg.from === 'bot' ? 'flex-start' : 'flex-end',
                    background: msg.from === 'bot' ? '#e0eafc' : '#d1fae5',
                    color: '#222',
                    borderRadius: 8,
                    padding: '0.5rem 0.9rem',
                    marginBottom: 2,
                    maxWidth: '80%',
                    gap: 8,
                  }}
                >
                  {msg.from === 'bot' && (
                    <span style={{ fontSize: 20, marginRight: 4 }} role="img" aria-label="bot">🤖</span>
                  )}
                  {msg.from === 'user' && (
                    <span style={{ fontSize: 20, marginRight: 4 }} role="img" aria-label="user">🧑</span>
                  )}
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', borderTop: '1px solid #eee', background: '#fff' }}>
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleChatSend(); }}
                placeholder="Type your message..."
                style={{ flex: 1, border: 'none', padding: '0.75rem', fontSize: '1rem', outline: 'none', background: 'none' }}
              />
              <button
                onClick={handleChatSend}
                style={{ background: '#43e97b', color: '#fff', border: 'none', padding: '0 1.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', borderRadius: 0 }}
              >Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
