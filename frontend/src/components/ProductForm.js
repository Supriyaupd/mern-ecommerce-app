import { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';

const CATEGORIES = ['Clothing','Books','Home & Garden','Toys','Beauty','Food & Grocery','Other'];

const EMPTY = { name: '', price: '', description: '', category: '', stock: '', image: null, imageUrl: '' };

export default function ProductForm({ product, onSuccess, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, price: product.price, description: product.description, category: product.category, stock: product.stock, image: null, imageUrl: product.image || '' });
      if (product.image) setPreview(product.image.startsWith('/') ? `http://localhost:5000${product.image}` : product.image);
    }
  }, [product]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.category) e.category = 'Category is required';
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Valid stock required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm((f) => ({ ...f, image: files[0], imageUrl: '' }));
      setPreview(URL.createObjectURL(files[0]));
    } else if (name === 'imageUrl') {
      setForm((f) => ({ ...f, imageUrl: value, image: null }));
      setPreview(value);
    } else {
      setForm((f) => ({ ...f, [name]: value }));
      if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('stock', form.stock);
      if (form.image) {
        fd.append('image', form.image);
      } else if (form.imageUrl) {
        fd.append('imageUrl', form.imageUrl);
      }
      if (isEdit) {
        await API.put(`/products/${product._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="form-group">
        <label className="form-label">Product Name</label>
        <input name="name" className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange} placeholder="e.g. Himalayan Honey" />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Price (Rs.)</label>
          <input name="price" type="number" step="0.01" min="0" className={`form-control ${errors.price ? 'error' : ''}`} value={form.price} onChange={handleChange} placeholder="0.00" />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Stock</label>
          <input name="stock" type="number" min="0" className={`form-control ${errors.stock ? 'error' : ''}`} value={form.stock} onChange={handleChange} placeholder="0" />
          {errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <select name="category" className={`form-control ${errors.category ? 'error' : ''}`} value={form.category} onChange={handleChange}>
          <option value="">Select category…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <span className="form-error">{errors.category}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" rows={4} className={`form-control ${errors.description ? 'error' : ''}`} value={form.description} onChange={handleChange} placeholder="Describe the product…" style={{ resize: 'vertical' }} />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Image URL (paste a link)</label>
        <input name="imageUrl" type="text" className="form-control" value={form.imageUrl} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
        {preview && (
          <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', marginTop: 8 }} />
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Or Upload Image File</label>
        <input name="image" type="file" accept="image/*" className="form-control" onChange={handleChange} style={{ padding: '8px' }} />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}