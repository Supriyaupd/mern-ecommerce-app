import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">S</span>
          <span className="logo-text">ShopMERN</span>
        </Link>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>Products</NavLink>
          {user && <NavLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</NavLink>}
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
        </nav>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" title="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-menu">
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="btn-hero-primary" style={{ padding: '8px 24px', fontSize: '14px' }}>Sign In</Link>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
