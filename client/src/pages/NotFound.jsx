import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] text-center px-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:wght@700&family=DM+Sans:wght@300;400;600&display=swap');`}</style>
      <div className="text-8xl mb-6 select-none" style={{ filter: 'grayscale(30%)' }}>🌶️</div>
      <h1 className="text-6xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.03em' }}>404</h1>
      <p className="text-xl text-gray-500 mb-2 font-light">This page got too spicy and disappeared.</p>
      <p className="text-sm text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary px-6 py-3 text-sm">← Back to Home</Link>
    </div>
  );
}
