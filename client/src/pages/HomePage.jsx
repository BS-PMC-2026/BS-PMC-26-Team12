import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTours } from '../api/tours';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&q=80';

const CARD_IMAGES = [
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
  'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80',
  'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&q=80',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
];

const DEMO_TOURS = [
  {
    _id: 'demo-1',
    title: 'Greenhouse\nSensory Walk',
    description: 'Immerse yourself in our state-of-the-art desert greenhouses. Experience the unique climate control systems, see peppers at every growth stage, and learn about advanced drip irrigation techniques.',
    duration: '90 minutes',
    group: 'Small groups',
    price: 45,
  },
  {
    _id: 'demo-2',
    title: 'Artisan Sauce\nMaking Workshop',
    description: 'Create your own signature hot sauce under the guidance of our master artisans. Select from over 20 pepper varieties, blend to your preference, and take home three custom bottles.',
    duration: '2 hours',
    group: 'Small groups',
    price: 75,
  },
  {
    _id: 'demo-3',
    title: 'Premium Tasting\nExperience',
    description: 'A curated journey through the world of rare and exotic peppers. Taste varieties from around the globe, learn flavor profiles, and pair peppers with local cheeses and artisan bread.',
    duration: '90 minutes',
    group: 'Small groups',
    price: 65,
  },
  {
    _id: 'demo-4',
    title: 'Extended\nEducational Tour',
    description: 'A comprehensive half-day tour covering the entire pepper cultivation process. From seed selection and planting through harvest and processing — the complete farm story told in full.',
    duration: '3 hours',
    group: 'Groups up to 12',
    price: 85,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);

  useEffect(() => {
    getTours()
      .then(({ data }) => { if (data?.length) setTours(data.slice(0, 4)); })
      .catch(() => {});
  }, []);

  const shopLink  = '/store';
  const toursLink = '/tours';
  const displayTours = tours.length > 0;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav style={{ background: '#171717', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 64px', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 24, textDecoration: 'none', letterSpacing: '-0.3px' }}>
            Dinerim
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            <Link to={shopLink}  style={navLink}>Shop</Link>
            <Link to={toursLink} style={navLink}>Tours</Link>
            <Link to="/cart" style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center', opacity: 0.88 }}>
              <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </Link>
            <Link to="/admin/login" style={staffBtn}>Staff Login</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 760,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center', color: '#FFFFFF', maxWidth: 820, padding: '80px 32px', width: '100%' }}>
          <h1 style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5, margin: '0 0 24px' }}>
            Welcome to<br />Dinerim
          </h1>
          <p style={{ fontSize: 26, lineHeight: 1.45, fontWeight: 400, margin: '0 0 40px', opacity: 0.95 }}>
            An experiential and unique pepper farm<br />in Southern Israel
          </p>

          {/* Info rows */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <InfoRow icon="pin"   text="Prigan, Southern Israel" />
            <InfoRow icon="clock" text="Sun–Thu 09:00–17:00 · Fri 09:00–13:00" />
            <InfoRow icon="mail"  text="info@dinerim.co.il" />
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={shopLink}  style={heroCta}>Shop Peppers</Link>
            <Link to={toursLink} style={heroCta}>Book a Tour</Link>
          </div>
        </div>
      </section>

      {/* ── TOURS SECTION ──────────────────────────────────────────────────── */}
      <section style={{ background: '#FAF9F5', padding: '108px 0 128px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px' }}>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2, color: '#171717', margin: '0 0 20px' }}>
              Our Farm Tours
            </h2>
            <p style={{ fontSize: 21, lineHeight: 1.55, color: '#666666', maxWidth: 850, margin: '0 auto' }}>
              Immersive experiences designed to connect you with the art and science of pepper cultivation
            </p>
          </div>

          {/* Cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '52px 40px' }}>
            {(displayTours ? tours : DEMO_TOURS).map((tour, i) => (
              <TourCard
                key={tour._id}
                tour={tour}
                image={CARD_IMAGES[i % CARD_IMAGES.length]}
                bookLink={toursLink}
                isDemo={!displayTours}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer style={{ background: '#171717', padding: '40px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px' }}>Dinerim</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>© 2026 Dinerim Pepper Farm · Southern Israel</span>
          <div style={{ display: 'flex', gap: 28 }}>
            <Link to="/guide/register" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13 }}>Become a Guide</Link>
            <Link to="/admin/login"    style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13 }}>Admin</Link>
          </div>
        </div>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 900px) {
          .tour-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 44px !important; }
          .hero-subtitle { font-size: 20px !important; }
          .section-heading { font-size: 32px !important; }
          .nav-inner { padding: 0 24px !important; }
          .footer-inner { padding: 32px 24px !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function InfoRow({ icon, text }) {
  const icons = {
    pin: (
      <svg width={18} height={18} fill="none" stroke="white" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    clock: (
      <svg width={18} height={18} fill="none" stroke="white" strokeWidth={1.75} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path strokeLinecap="round" d="M12 6v6l4 2"/>
      </svg>
    ),
    mail: (
      <svg width={18} height={18} fill="none" stroke="white" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, color: 'rgba(255,255,255,0.90)' }}>
      {icons[icon]}
      <span>{text}</span>
    </div>
  );
}

function TourCard({ tour, image, bookLink, isDemo }) {
  const [imgError, setImgError] = useState(false);
  const title    = tour.title;
  const duration = isDemo ? tour.duration : (tour.time    || '2 hours');
  const group    = isDemo ? tour.group    : `Max ${tour.maxParticipants} guests`;

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 8, boxShadow: '0 2px 14px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
      {!imgError ? (
        <img
          src={image}
          alt={title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: 220, background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={48} height={48} fill="none" stroke="#4CAF50" strokeWidth={1.25} viewBox="0 0 24 24" style={{ opacity: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
          </svg>
        </div>
      )}

      <div style={{ padding: '36px 34px 32px' }}>
        <h3 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.35, color: '#171717', margin: '0 0 16px', whiteSpace: 'pre-line' }}>
          {title}
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, color: '#666666', margin: '0 0 24px' }}>
          {tour.description}
        </p>

        {/* Metadata row */}
        <div style={{ display: 'flex', gap: 28, color: '#737373', fontSize: 15, marginBottom: 32 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/>
            </svg>
            {duration}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            {group}
          </span>
        </div>

        {/* Price + book button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: '#737373', marginBottom: 2 }}>From</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#16A34A', lineHeight: 1 }}>${tour.price}</div>
            <div style={{ fontSize: 13, color: '#737373', marginTop: 4 }}>per person</div>
          </div>
          <Link to={bookLink} style={bookBtn}>Book This Tour</Link>
        </div>
      </div>
    </div>
  );
}

/* ── Shared style objects ─────────────────────────────────────────────────── */

const navLink = {
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 500,
  opacity: 0.88,
};

const staffBtn = {
  background: '#FFFFFF',
  color: '#171717',
  padding: '11px 26px',
  borderRadius: 6,
  fontWeight: 600,
  fontSize: 14,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const heroCta = {
  background: '#FFFFFF',
  color: '#171717',
  padding: '0 52px',
  height: 62,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 9999,
  fontSize: 17,
  fontWeight: 700,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
};

const bookBtn = {
  background: '#16A34A',
  color: '#FFFFFF',
  padding: '0 28px',
  height: 52,
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 700,
  textDecoration: 'none',
  flexShrink: 0,
};
