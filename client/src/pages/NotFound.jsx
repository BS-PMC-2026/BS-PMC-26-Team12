import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-300 flex flex-col items-center justify-center text-center px-6 relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(232,68,32,0.06), transparent)' }} />
      <div className="relative z-10">
        <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float" style={{ background: 'rgba(232,68,32,0.08)', border: '1px solid rgba(232,68,32,0.12)' }}>
          <svg className="w-12 h-12" style={{ color: '#E84420' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
        </div>
        <h1 className="text-8xl font-black mb-3 tracking-tight font-display" style={{ color: 'rgba(232,68,32,0.15)' }}>404</h1>
        <p className="text-xl text-cream mb-2">This page got too spicy and disappeared.</p>
        <p className="text-sm text-cream-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-fire px-8 py-3.5 text-sm rounded-full">← Back to Home</Link>
      </div>
    </div>
  );
}
