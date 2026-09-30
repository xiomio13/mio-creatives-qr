// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

/**
 * Custom Hook para persistencia reactiva en localStorage.
 *
 * @template T
 * @param {string} key - Clave de almacenamiento.
 * @param {T} initialValue - Valor por defecto si no existe o falla la lectura.
 * @returns {[T, (value: T | ((val: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error leyendo la clave "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(
        `[useLocalStorage] Error escribiendo la clave "${key}":`,
        error,
      );
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
