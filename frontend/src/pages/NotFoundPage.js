import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main style={{ minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 15vw, 140px)', fontWeight: 800, lineHeight: 1, color: 'var(--border-light)', marginBottom: 8 }}>
          404
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/products" className="btn btn-ghost">Browse Products</Link>
        </div>
      </div>
    </main>
  );
}
