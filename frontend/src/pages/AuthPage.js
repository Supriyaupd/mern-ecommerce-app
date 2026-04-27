import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (mode === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back!');
      } else {
        await register(form.name, form.email, form.password);
        toast.success('Account created!');
      }
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="logo-mark">S</span>
            <span className="logo-text">ShopMERN</span>
          </Link>
          <h1 className="auth-title">{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
          <p className="auth-sub">{mode === 'login' ? 'Sign in to continue shopping' : 'Join thousands of shoppers'}</p>
        </div>

        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setErrors({}); }}>Sign In</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setErrors({}); }}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange} placeholder="John Doe" />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input name="email" type="email" className={`form-control ${errors.email ? 'error' : ''}`} value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className={`form-control ${errors.password ? 'error' : ''}`} value={form.password} onChange={handleChange} placeholder="••••••••" />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-link" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErrors({}); }}>
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </main>
  );
}
