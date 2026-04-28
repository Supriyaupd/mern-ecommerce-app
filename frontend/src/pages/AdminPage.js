import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import './AdminPage.css';

export default function AdminPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [tab, setTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, outOfStock: 0 });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products', { params: { limit: 100 } });
      setProducts(data.products);
      const outOfStock = data.products.filter(p => p.stock === 0).length;
      setStats(s => ({ ...s, totalProducts: data.total, outOfStock }));
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const { data } = await API.get('/orders/all');
      setOrders(data.orders);
      const revenue = data.orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0);
      setStats(s => ({ ...s, totalOrders: data.orders.length, totalRevenue: revenue }));
    } catch { toast.error('Failed to load orders'); }
    finally { setOrdersLoading(false); }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    // Handle deep-link edit from product detail page
    const editId = searchParams.get('edit');
    if (editId) {
      API.get(`/products/${editId}`).then(({ data }) => {
        setEditProduct(data.product);
        setShowModal(true);
      }).catch(() => {});
    }
  }, [fetchProducts, fetchOrders, searchParams]);

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete product'); }
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditProduct(null);
    fetchProducts();
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  const STATUS_OPTS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  

  return (
    <main className="page">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin Dashboard</h1>
            <p className="section-subtitle">Manage products, orders and inventory</p>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => { setEditProduct(null); setShowModal(true); }}>
            + New Product
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label: 'Total Products', value: stats.totalProducts, icon: '📦' },
            { label: 'Total Orders', value: stats.totalOrders, icon: '🧾' },
            { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: '💰' },
            { label: 'Out of Stock', value: stats.outOfStock, icon: '⚠️', warn: stats.outOfStock > 0 },
          ].map((s) => (
            <div key={s.label} className={`stat-card ${s.warn ? 'stat-warn' : ''}`}>
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-card-val">{s.value}</span>
              <span className="stat-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            Products ({products.length})
          </button>
          <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Orders ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          loading ? <div className="spinner-wrap"><div className="spinner" /></div> :
          products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Create your first product to get started</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Product</button>
            </div>
          ) : (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p._id} product={p} isAdminView onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          )
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          ordersLoading ? <div className="spinner-wrap"><div className="spinner" /></div> :
          orders.length === 0 ? (
            <div className="empty-state"><h3>No orders yet</h3></div>
          ) : (
            <div className="admin-orders">
              <div className="orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className="order-id-cell">#{order._id.slice(-8).toUpperCase()}</td>
                        <td>
                          <div className="customer-cell">
                            <span>{order.user?.name || 'Unknown'}</span>
                            <span className="customer-email">{order.user?.email}</span>
                          </div>
                        </td>
                        <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                        <td className="total-cell">${order.totalAmount.toFixed(2)}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            {STATUS_OPTS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); setEditProduct(null); } }}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editProduct ? 'Edit Product' : 'New Product'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); setEditProduct(null); }}>✕</button>
            </div>
            <ProductForm product={editProduct} onSuccess={handleFormSuccess} onClose={() => { setShowModal(false); setEditProduct(null); }} />
          </div>
        </div>
      )}
    </main>
  );
}
