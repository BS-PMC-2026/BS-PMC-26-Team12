import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function GuideDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4faf4]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .a0 { animation: fadeUp 0.4s 0.00s ease both; }
        .a1 { animation: fadeUp 0.4s 0.08s ease both; }
        .a2 { animation: fadeUp 0.4s 0.16s ease both; }
        .a3 { animation: fadeUp 0.4s 0.24s ease both; }
      `}</style>

      <Navbar />

      {/* Header */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a2d0a 0%, #2d4a1a 55%, #1e3a10 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[110px] opacity-10 select-none pointer-events-none">🌿</div>

        <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">Guide Portal</p>
          <h1 className="text-4xl font-bold text-white mb-1.5" style={{ fontFamily: "'Lora', serif", letterSpacing: '-0.02em' }}>
            Welcome back, {user?.fullName?.split(' ')[0]}
          </h1>
          <p className="text-green-200/60 text-sm font-light">
            You're signed in as an approved guide — browse the pepper catalog below.
          </p>
        </div>

        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 32" fill="none" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 32V16C480 0 960 32 1440 16V32H0Z" fill="#f4faf4"/>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-5">

        {/* Profile card */}
        <div className="card rounded-2xl overflow-hidden a0">
          <div className="h-1" style={{ background: 'linear-gradient(to right, #2d5a1b, #4a7c2d, #86efac)' }} />
          <div className="p-6">
            <div className="flex flex-wrap items-start gap-5">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2d5a1b, #4a7c2d)' }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "'Lora', serif" }}>
                    {user?.fullName}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Approved Guide
                  </span>
                </div>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid sm:grid-cols-3 gap-3 mt-5">
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Role</p>
                <p className="text-sm font-semibold text-gray-800">Farm Guide</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Account Status</p>
                <p className="text-sm font-semibold text-emerald-700">✓ Active & Approved</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Access Level</p>
                <p className="text-sm font-semibold text-gray-800">Pepper Catalog + Profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 a1">

          {/* Browse Peppers — primary action */}
          <Link to="/peppers"
            className="group card rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-2 border-transparent hover:border-emerald-200">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #fef2f2, #ffe5d5)' }}>
              🌶️
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-pepper-600 transition-colors"
                style={{ fontFamily: "'Lora', serif" }}>
                Browse Pepper Catalog
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Search and explore the full pepper encyclopedia — varieties, heat levels, origins, and more.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-pepper-600 mt-2 group-hover:gap-2 transition-all">
                Open catalog
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
            </div>
          </Link>

          {/* Coming soon — future tours */}
          <div className="card rounded-2xl p-6 flex items-start gap-4 opacity-70 cursor-not-allowed"
            style={{ background: 'repeating-linear-gradient(45deg, #f9fafb, #f9fafb 10px, #f4f4f5 10px, #f4f4f5 20px)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-100">
              🗓️
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-500" style={{ fontFamily: "'Lora', serif" }}>
                  Tour Schedule
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                  Coming Soon
                </span>
              </div>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                View and manage your assigned tours. Available in the next release.
              </p>
            </div>
          </div>
        </div>

        {/* Info notice */}
        <div className="a2 rounded-2xl p-5 border border-emerald-200 flex gap-4 items-start"
          style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
          <span className="text-2xl flex-shrink-0">🌱</span>
          <div>
            <h4 className="font-semibold text-emerald-900 text-sm mb-0.5" style={{ fontFamily: "'Lora', serif" }}>
              Your account is fully set up
            </h4>
            <p className="text-emerald-700 text-sm font-light leading-relaxed">
              As an approved guide you have full access to the pepper catalog. Tour management and reporting features are planned for the next scope — stay tuned.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
