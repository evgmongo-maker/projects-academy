import React from 'react';

const projects = [
	{
		id: 1,
		title: 'Personal Blog',
		description: 'A blog built with Gatsby and Markdown.',
		image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
	},
	{
		id: 2,
		title: 'E-commerce Store',
		description: 'A React/Redux powered online shop.',
		image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
	},
	{
		id: 3,
		title: 'Photo Gallery',
		description: 'A gallery app using Unsplash API.',
		image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
	},
	{
		id: 4,
		title: 'Landing Page',
		description: 'A modern landing page with animations.',
		image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
	},
	{
		id: 5,
		title: 'Portfolio Redesign',
		description: 'A redesign of my personal portfolio.',
		image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
	},
];

const PortfolioGallery: React.FC = () => {
		return (
			<div style={{
				minHeight: '100vh',
				width: '100vw',
				background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)',
				padding: '2rem 0',
			}}>
				<header style={{
					maxWidth: 900,
					margin: '0 auto 2rem auto',
					padding: '2rem',
					background: 'rgba(255,255,255,0.22)',
					borderRadius: 24,
					boxShadow: '0 8px 32px rgba(31,38,135,0.18)',
					textAlign: 'center',
					position: 'relative',
				}}>
					<h1 style={{ fontWeight: 'bold', fontSize: '2.5rem', color: '#213547', marginBottom: 10 }}>Portfolio Gallery</h1>
					<p style={{ fontSize: 20, color: '#444' }}>Explore a selection of modern web projects below.</p>
					<a href="/" style={{
						position: 'absolute',
						top: 24,
						right: 32,
						background: 'linear-gradient(90deg,#43e97b 0%, #2563eb 100%)',
						color: '#fff',
						fontWeight: 700,
						border: 'none',
						borderRadius: 14,
						padding: '0.7rem 1.7rem',
						fontSize: 18,
						boxShadow: '0 2px 12px rgba(67,233,123,0.10)',
						textDecoration: 'none',
						cursor: 'pointer',
						letterSpacing: 1,
					}}>← Home</a>
				</header>
				<main style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
					{projects.map(project => (
						<div key={project.id} style={{
							width: 320,
							background: 'rgba(255,255,255,0.98)',
							borderRadius: 18,
							boxShadow: '0 4px 16px rgba(67,233,123,0.08)',
							padding: 24,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							transition: 'box-shadow 0.2s',
						}}>
							<img src={project.image} alt={project.title} style={{ width: '100%', borderRadius: 14, marginBottom: 18, height: 180, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
							<h3 style={{ color: '#222', marginBottom: 8, fontWeight: 600, fontSize: 22 }}>{project.title}</h3>
							<p style={{ minHeight: 60, color: '#444', marginBottom: 12, fontSize: 16, textAlign: 'center', opacity: 0.92 }}>{project.description}</p>
						</div>
					))}
				</main>
			</div>
		);
};

export default PortfolioGallery;
