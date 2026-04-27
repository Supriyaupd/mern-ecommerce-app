import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.product);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please sign in first'); navigate('/auth'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      navigate('/products');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!product) return null;

  const stockStatus = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in';
  const imgSrc = product.image ? (product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image) : null;

  return (
    <main className="page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-image">
            {imgSrc ? (
              <img src={imgSrc} alt={product.name} />
            ) : (
              <div className="product-detail-placeholder">
                <span style={{ fontSize: 80 }}>📦</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <span className="badge badge-muted">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <div className="product-detail-price">${product.price.toFixed(2)}</div>

            <p className="product-detail-desc">{product.description}</p>

            <div className="product-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Stock</span>
                <span className={`meta-val ${stockStatus === 'out' ? 'text-danger' : stockStatus === 'low' ? 'text-warning' : 'text-success'}`}>
                  {product.stock === 0 ? 'Out of Stock' : `${product.stock} units`}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-val">{product.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Added</span>
                <span className="meta-val">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="quantity-row">
                <span className="meta-label">Quantity</span>
                <div className="quantity-control">
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                style={{ flex: 1 }}
              >
                {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding…' : '🛒 Add to Cart'}
              </button>

              {isAdmin && (
                <>
                  <Link to={`/admin?edit=${product._id}`} className="btn btn-secondary btn-lg">Edit</Link>
                  <button className="btn btn-danger btn-lg" onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
