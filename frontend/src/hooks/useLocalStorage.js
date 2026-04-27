import { useState, useEffect } from 'react';

/**
 * useLocalStorage — syncs state to localStorage.
 *
 * @param {string} key        — localStorage key
 * @param {*} initialValue    — default value if key doesn't exist
 * @returns {[value, setValue]}
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota errors
    }
  }, [key, value]);

  const remove = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove];
}
