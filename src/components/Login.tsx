import React, { useState } from 'react';

interface User {
  username: string;
  password: string;
  email?: string;
}

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        onLogin(data.user);
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password || !email) {
      setError('All fields are required');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        setMode('signin');
        setUsername('');
        setPassword('');
        setEmail('');
        alert('Account created! Please sign in.');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(56, 89, 146, 0.10)',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        minWidth: 340,
        maxWidth: 360,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button
            onClick={() => setMode('signin')}
            style={{
              background: mode === 'signin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'none',
              color: mode === 'signin' ? '#fff' : '#667eea',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              marginRight: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >Sign In</button>
          <button
            onClick={() => setMode('signup')}
            style={{
              background: mode === 'signup' ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' : 'none',
              color: mode === 'signup' ? '#fff' : '#43e97b',
              border: 'none',
              borderRadius: 8,
              padding: '0.5rem 1.5rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >Sign Up</button>
        </div>
        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: '1rem',
                marginBottom: 2,
              }}
              autoComplete="username"
            />
          </div>
          {mode === 'signup' && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '1rem',
                  marginBottom: 2,
                }}
                autoComplete="email"
              />
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                fontSize: '1rem',
                marginBottom: 2,
              }}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>
          {error && <div style={{ color: '#e53e3e', marginBottom: 12, fontWeight: 500 }}>{error}</div>}
          <button
            type="submit"
            style={{
              width: '100%',
              background: mode === 'signin'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem',
              fontWeight: 600,
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: 6,
              marginBottom: 2,
              boxShadow: '0 2px 8px rgba(67,233,123,0.10)',
              transition: 'background 0.2s',
            }}
          >{mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
