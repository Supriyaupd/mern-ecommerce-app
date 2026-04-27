import { Link } from 'react-router-dom';
import './Footer.css';

const LINKS = {
  Shop: [
    { label: 'All Products', to: '/products' },
    { label: 'Clothing', to: '/products?category=Clothing' },
    { label: 'Books', to: '/products?category=Books' },
    { label: 'Home & Garden', to: '/products?category=Home & Garden' },
  ],
  Account: [
    { label: 'Sign In', to: '/auth' },
    { label: 'Register', to: '/auth' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Cart', to: '/cart' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="logo-mark">S</span>
            <span className="logo-text">ShopMERN</span>
          </div>
          <p className="footer-tagline">
            A full-featured e-commerce platform built with the MERN stack.
          </p>
          <div className="footer-stack">
            {['MongoDB', 'Express', 'React', 'Node.js'].map((t) => (
              <span key={t} className="stack-badge">{t}</span>
            ))}
          </div>
        </div>

        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section} className="footer-col">
            <h4 className="footer-heading">{section}</h4>
            <ul className="footer-list">
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} ShopMERN. Built for educational purposes.</span>
          <span className="footer-tech">MongoDB · Express · React · Node.js</span>
        </div>
      </div>
    </footer>
  );
}
