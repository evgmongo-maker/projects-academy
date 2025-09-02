
import React, { useState } from 'react';

type User = {
	username: string;
	email?: string;
};


const backgroundManUrl = 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=900&q=80'; // Placeholder, replace with your own if needed

interface LoginProps {
	onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		try {
			const response = await fetch('http://localhost:4000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Login failed');
			}
			const data = await response.json();
			if (data.token) {
				localStorage.setItem('token', data.token);
				if (data.user) {
					onLogin(data.user);
				} else {
					onLogin({ username });
				}
			} else {
				throw new Error('No token received');
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message || 'Login failed');
			} else {
				setError('Login failed');
			}
		}
	};

	return (
		<div
			style={{
				minHeight: '100vh',
				width: '100vw',
				background: `linear-gradient(90deg, #1e3c5e 0%, #2563eb 60%, #1e3c5e 100%)`,
				position: 'relative',
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Man pointing with finger as background image */}
			<img
				src={backgroundManUrl}
				alt="Man pointing with finger"
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: '100vw',
					height: '100vh',
					objectFit: 'cover',
					opacity: 0.32,
					zIndex: 0,
					pointerEvents: 'none',
				}}
			/>
			{/* Blurred overlay for left side */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: '60vw',
					height: '100vh',
					background: 'rgba(30,60,94,0.7)',
					backdropFilter: 'blur(2px)',
					zIndex: 1,
				}}
			/>
			{/* Centered login form */}
			<div
				style={{
					position: 'relative',
					zIndex: 2,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					minWidth: 380,
					padding: '48px 40px 40px 40px',
					background: 'rgba(255,255,255,0.08)',
					borderRadius: 16,
					boxShadow: '0 8px 40px 0 rgba(30,60,94,0.18)',
				}}
			>
				{/* User icon */}
				<div
					style={{
						width: 72,
						height: 72,
						borderRadius: '50%',
						background: 'rgba(255,255,255,0.18)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						marginBottom: 32,
						boxShadow: '0 2px 12px 0 rgba(30,60,94,0.10)',
					}}
				>
					<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
						<circle cx="20" cy="14" r="8" fill="#fff" fillOpacity="0.9" />
						<ellipse cx="20" cy="30" rx="12" ry="7" fill="#fff" fillOpacity="0.7" />
					</svg>
				</div>
				{/* Login form fields */}
				<form onSubmit={handleSignIn} style={{ width: '100%' }}>
					<div style={{ position: 'relative', marginBottom: 24 }}>
						{/* Username icon */}
						<span style={{
							position: 'absolute',
							left: 16,
							top: '50%',
							transform: 'translateY(-50%)',
							color: '#2563eb',
							opacity: 0.85,
							fontSize: 22,
							display: 'flex',
							alignItems: 'center',
							zIndex: 2,
						}}>
							<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/></svg>
						</span>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={e => setUsername(e.target.value)}
							style={{
								width: '100%',
								padding: '14px 16px 14px 48px',
								border: '1.5px solid #fff',
								borderRadius: 8,
								background: 'rgba(255,255,255,0.10)',
								color: '#fff',
								fontSize: 18,
								outline: 'none',
								marginBottom: 0,
								boxSizing: 'border-box',
								fontWeight: 400,
								letterSpacing: 0.5,
							}}
							autoComplete="username"
							required
						/>
					</div>
					<div style={{ position: 'relative', marginBottom: 16 }}>
						{/* Password icon */}
						<span style={{
							position: 'absolute',
							left: 16,
							top: '50%',
							transform: 'translateY(-50%)',
							color: '#2563eb',
							opacity: 0.85,
							fontSize: 22,
							display: 'flex',
							alignItems: 'center',
							zIndex: 2,
						}}>
							<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-2V9a6 6 0 1 0-12 0v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2Zm-2 0H8V9a4 4 0 1 1 8 0v6Z"/></svg>
						</span>
						<input
							type="password"
							placeholder="************"
							value={password}
							onChange={e => setPassword(e.target.value)}
							style={{
								width: '100%',
								padding: '14px 16px 14px 48px',
								border: '1.5px solid #fff',
								borderRadius: 8,
								background: 'rgba(255,255,255,0.10)',
								color: '#fff',
								fontSize: 18,
								outline: 'none',
								marginBottom: 0,
								boxSizing: 'border-box',
								fontWeight: 400,
								letterSpacing: 1,
							}}
							autoComplete="current-password"
							required
						/>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, marginTop: 2 }}>
						<label style={{ color: '#fff', opacity: 0.85, fontSize: 15, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
							<input type="checkbox" style={{ marginRight: 6, accentColor: '#2563eb' }} />
							Remember Me
						</label>
						<a href="#" style={{ color: '#60a5fa', fontSize: 15, textDecoration: 'none', opacity: 0.95 }}>Forgot Password?</a>
					</div>
					{error && <div style={{ color: '#e53e3e', marginBottom: 12, fontWeight: 500, textAlign: 'center' }}>{error}</div>}
					<button
						type="submit"
						style={{
							width: '100%',
							padding: '12px 0',
							borderRadius: 24,
							border: 'none',
							background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)',
							color: '#fff',
							fontSize: 20,
							fontWeight: 500,
							boxShadow: '0 0 16px 2px #2563eb55',
							cursor: 'pointer',
							transition: 'background 0.2s',
							marginTop: 8,
							marginBottom: 0,
							letterSpacing: 1,
						}}
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
