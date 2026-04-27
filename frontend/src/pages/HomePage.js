import { Link } from 'react-router-dom';
import './HomePage.css';

const FEATURES = [
  { icon: '⚡', title: 'Fast Delivery', desc: 'Same-day shipping on thousands of items.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'JWT-protected checkout you can trust.' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy.' },
  { icon: '🎯', title: 'Best Prices', desc: 'Guaranteed lowest prices on all products.' },
];

const CATEGORIES = [
  { name: 'Clothing', emoji: '👕', color: '#f48fb1' },
  { name: 'Books', emoji: '📚', color: '#a5d6a7' },
  { name: 'Beauty', emoji: '✨', color: '#ce93d8' },
  { name: 'Home & Garden', emoji: '🏡', color: '#80cbc4' },
];

export default function HomePage() {
  return (
    <main>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container">
          <div className="hero-inner">

            {/* Left side — Text */}
            <div className="hero-content">
              <h1 className="hero-title">
                The Future of<br />
                <span className="hero-accent">Online Shopping</span>
              </h1>
              <p className="hero-sub">
                Discover thousands of products across all categories. Built with MongoDB, Express, React & Node.js.
              </p>
              <div className="hero-cta">
  <Link to="/products" className="btn-hero-primary">Shop Now →</Link>
  <Link to="/auth" className="btn-hero-ghost">Create Account</Link>
</div>
              <div className="hero-stats">
                <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Products</span></div>
                <div className="stat-div" />
                <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Customers</span></div>
                <div className="stat-div" />
                <div className="stat"><span className="stat-num">99%</span><span className="stat-label">Satisfaction</span></div>
              </div>
            </div>

            {/* Right side — Image */}
            <div className="hero-image-side">
              <img
                src="https://images.pexels.com/photos/6214155/pexels-photo-6214155.jpeg"
                alt="Shopping"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card" style={{ '--cat-color': cat.color }}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2 className="cta-title">Ready to start shopping?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Join thousands of happy customers today.</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">Explore Products →</Link>
        </div>
      </section>

    </main>
  );
}