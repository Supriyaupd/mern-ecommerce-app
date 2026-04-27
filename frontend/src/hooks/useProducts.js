import { useState, useEffect, useCallback } from 'react';
import API from '../api';

/**
 * useProducts — fetches paginated/filtered products from the API.
 *
 * @param {object} filters  — { search, category, minPrice, maxPrice, sort, page, limit }
 * @param {boolean} skip    — set true to delay fetching (e.g. while params are building)
 * @returns {{ products, loading, error, pagination, refetch }}
 */
export function useProducts(filters = {}, skip = false) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchProducts = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const params = { limit: 12, ...filters };
      // Remove empty/falsy filter values
      Object.keys(params).forEach((k) => {
        if (params[k] === '' || params[k] === null || params[k] === undefined) {
          delete params[k];
        }
      });
      const { data } = await API.get('/products', { params });
      setProducts(data.products);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), skip]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, pagination, refetch: fetchProducts };
}

/**
 * useProduct — fetches a single product by ID.
 *
 * @param {string} id — product ID
 * @returns {{ product, loading, error, refetch }}
 */
export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.product);
    } catch (err) {
      setError(err.response?.data?.message || 'Product not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}
