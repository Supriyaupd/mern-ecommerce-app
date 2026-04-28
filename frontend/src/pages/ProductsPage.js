import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const CATEGORIES = ['All','Clothing','Books','Home & Garden','Toys','Beauty','Food & Grocery'];

export default function ProductsPage() {
 const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setPagination({ total: data.total, totalPages: data.totalPages, currentPage: data.currentPage });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, minPrice, maxPrice, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <main className="page products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <div>
            <h1 className="section-title">Products</h1>
            <p className="section-subtitle">{pagination.total} items available</p>
          </div>
          <div className="sort-control">
            <select className="form-control" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3 className="filter-heading">Search</h3>
              <form onSubmit={handleSearch}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-control" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm">Go</button>
                </div>
              </form>
            </div>

            <div className="filter-section">
              <h3 className="filter-heading">Category</h3>
              <div className="category-filter-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-filter-btn ${category === cat ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h3 className="filter-heading">Price Range</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input className="form-control" type="number" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} min="0" />
                <span style={{ color: 'var(--text-muted)' }}>–</span>
                <input className="form-control" type="number" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} min="0" />
              </div>
              {(minPrice || maxPrice) && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => { setMinPrice(''); setMaxPrice(''); setPage(1); }}>
                  Clear Range
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="products-main">
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p, i) => (
                    <div key={p._id} className="fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
