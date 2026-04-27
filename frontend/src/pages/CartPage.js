import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import API from '../api';
import './CartPage.css';

export default function CartPage() {
  const { cart, cartTotal, cartLoading, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [shipping, setShipping] = useState({ street: '', city: '', state: '', zipCode: '', country: '' });
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = async (productId, qty) => {
    try { await updateCartItem(productId, Number(qty)); }
    catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success('Item removed'); }
    catch { toast.error('Failed to remove item'); }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacingOrder(true);
    try {
      await API.post('/orders', { shippingAddress: shipping });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartLoading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (cart.length === 0) return (
    <main className="page">
      <div className="container">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="page">
      <div className="container">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="section-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {cart.map((item) => {
              const p = item.product;
              if (!p) return null;
              const imgSrc = p.image ? (p.image.startsWith('/') ? `http://localhost:5000${p.image}` : p.image) : null;
              return (
                <div key={p._id} className="cart-item">
                  <div className="cart-item-img">
                    {imgSrc ? <img src={imgSrc} alt={p.name} /> : <span style={{ fontSize: 32 }}>📦</span>}
                  </div>
                  <div className="cart-item-info">
                    <Link to={`/products/${p._id}`} className="cart-item-name">{p.name}</Link>
                    <span className="cart-item-price">${p.price?.toFixed(2)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button className="qty-btn" onClick={() => handleQuantityChange(p._id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleQuantityChange(p._id, item.quantity + 1)} disabled={item.quantity >= p.stock}>+</button>
                    </div>
                    <span className="cart-item-subtotal">${(p.price * item.quantity).toFixed(2)}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleRemove(p._id)}>✕ Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <aside className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-rows">
              {cart.map((item) => item.product && (
                <div key={item.product._id} className="summary-row">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${cartTotal.toFixed(2)}</span>
            </div>

            {!showCheckout ? (
              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }} onClick={() => setShowCheckout(true)}>
                Proceed to Checkout →
              </button>
            ) : (
              <form onSubmit={handlePlaceOrder} className="checkout-form">
                <h3 className="checkout-heading">Shipping Address</h3>
                {['street', 'city', 'state', 'zipCode', 'country'].map((field) => (
                  <input key={field} className="form-control" required placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={shipping[field]} onChange={(e) => setShipping(s => ({ ...s, [field]: e.target.value }))} />
                ))}
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={placingOrder}>
                  {placingOrder ? 'Placing Order…' : '🎉 Place Order'}
                </button>
                <button type="button" className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setShowCheckout(false)}>
                  Back to Cart
                </button>
              </form>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
