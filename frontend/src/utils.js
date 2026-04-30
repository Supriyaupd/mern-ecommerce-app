import { toast } from 'react-toastify';

/**
 * Centralized toast notification helpers.
 * Provides consistent messaging patterns across the app.
 */

export const notify = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.info(msg),
  warn: (msg) => toast.warn(msg),

  /** Extracts a message from an Axios error response, with a fallback */
  apiError: (err, fallback = 'Something went wrong. Please try again.') => {
    const msg =
      err?.response?.data?.errors?.[0]?.message ||
      err?.response?.data?.message ||
      err?.message ||
      fallback;
    toast.error(msg);
  },

  /** Promise-based toast (loading → success/error) */
  promise: (promise, { loading, success, error }) =>
    toast.promise(promise, { pending: loading, success, error }),
};

/**
 * Format a price number to a USD string.
 * @param {number} value
 * @returns {string}  e.g. "$49.99"
 */
export const formatPrice = (value) =>
  new Intl.NumberFormat('ne-NP', { style: 'currency', currency: 'NPR' }).format(value);

/**
 * Format an ISO date string to a readable format.
 * @param {string} dateStr
 * @param {object} opts — Intl.DateTimeFormat options
 */
export const formatDate = (dateStr, opts = { year: 'numeric', month: 'short', day: 'numeric' }) =>
  new Date(dateStr).toLocaleDateString('en-US', opts);

/**
 * Truncate a string to a max length with ellipsis.
 */
export const truncate = (str, max = 80) =>
  str && str.length > max ? str.slice(0, max).trimEnd() + '…' : str;

/**
 * Capitalise the first letter of a string.
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Build the full image URL for a product.
 * Handles both relative paths (from Multer) and absolute URLs.
 */
export const getImageUrl = (imagePath, baseUrl = 'http://localhost:5000') => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${baseUrl}${imagePath}`;
};
