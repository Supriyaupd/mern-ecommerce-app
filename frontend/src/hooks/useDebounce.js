import { useState, useEffect } from 'react';

/**
 * useDebounce — delays updating a value until after a quiet period.
 * Ideal for search inputs to avoid firing on every keystroke.
 *
 * @param {*} value       — value to debounce
 * @param {number} delay  — milliseconds to wait (default 400)
 * @returns {*} debouncedValue
 *
 * @example
 * const debouncedSearch = useDebounce(searchInput, 400);
 * useEffect(() => { fetchProducts(debouncedSearch); }, [debouncedSearch]);
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
