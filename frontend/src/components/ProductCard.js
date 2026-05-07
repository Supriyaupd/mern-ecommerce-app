import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const CATEGORIES_EMOJI = {
   Clothing: '👕', Books: '📚', 'Home & Garden': '🏡',
  Sports: '⚽', Toys: '🧸', Beauty: '✨', 
  'Food & Grocery': '🛒', Other: '📦',
};

export default function ProductCard({ product, onEdit, onDelete, isAdminView }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to add items to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const stockStatus = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in';

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image} alt={product.name} />
        ) : (
          <div className="product-card-placeholder">
            <span>{CATEGORIES_EMOJI[product.category] || '📦'}</span>
          </div>
        )}
        <span className={`stock-dot stock-${stockStatus}`} title={stockStatus === 'out' ? 'Out of stock' : stockStatus === 'low' ? 'Low stock' : 'In stock'} />
      </div>

      <div className="product-card-body">
        <div className="product-card-meta">
          <span className="badge badge-accent">{product.category}</span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-price">Rs. {product.price.toFixed(2)}</span>
          {isAdminView ? (
            <div className="admin-actions" onClick={(e) => e.preventDefault()}>
              <button className="btn btn-ghost btn-sm" onClick={() => onEdit(product)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(product._id)}>Del</button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm add-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sold Out' : '+ Cart'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
