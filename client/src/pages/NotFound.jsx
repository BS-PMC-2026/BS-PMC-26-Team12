import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col items-center justify-center text-center px-6 relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(232,68,32,0.06), transparent)' }} />
      <div className="relative z-10">
        <div className="text-8xl mb-6 select-none animate-float">🌶️</div>
        <h1 className="text-8xl font-black mb-3 tracking-tight font-display" style={{ color: 'rgba(232,68,32,0.15)' }}>404</h1>
        <p className="text-xl text-cream mb-2">This page got too spicy and disappeared.</p>
        <p className="text-sm text-cream-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-fire px-8 py-3.5 text-sm rounded-full">← Back to Home</Link>
      </div>
    </div>
  );
}
