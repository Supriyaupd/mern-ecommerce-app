import { useState, useEffect } from 'react';
import API from '../api';
import './OrdersPage.css';

const STATUS_STYLES = {
  pending:    { cls: 'badge-warning',  label: 'Pending' },
  processing: { cls: 'badge-accent',   label: 'Processing' },
  shipped:    { cls: 'badge-accent',   label: 'Shipped' },
  delivered:  { cls: 'badge-success',  label: 'Delivered' },
  cancelled:  { cls: 'badge-danger',   label: 'Cancelled' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;

  if (orders.length === 0) return (
    <main className="page">
      <div className="container">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="2"/>
            <path d="M9 12h6M9 16h4"/>
          </svg>
          <h3>No orders yet</h3>
          <p>Start shopping to place your first order</p>
          <a href="/products" className="btn btn-primary">Browse Products</a>
        </div>
      </div>
    </main>
  );

  return (
    <main className="page">
      <div className="container">
        <h1 className="section-title">Your Orders</h1>
        <p className="section-subtitle">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>

        <div className="orders-list">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="order-card">
                <button className="order-header" onClick={() => setExpanded(isOpen ? null : order._id)}>
                  <div className="order-header-left">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className={`badge ${status.cls}`}>{status.label}</span>
                  </div>
                  <div className="order-header-right">
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="order-total">Rs. {order.totalAmount.toLocaleString()}</span>
                    <span className="order-chevron" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="order-body">
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-qty">× {item.quantity}</span>
                          <span className="order-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress?.city && (
                      <div className="order-shipping">
                        <span className="meta-label">Ships to</span>
                        <span className="shipping-addr">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                        </span>
                      </div>
                    )}
                    <div className="order-summary-row">
                      <span>Total ({order.items.length} item{order.items.length !== 1 ? 's' : ''})</span>
                      <span className="order-grand-total">Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
