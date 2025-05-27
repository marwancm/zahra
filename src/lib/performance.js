/**
 * Performance utilities for optimizing React components and application performance
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - The image source to use
 */
export function useLazyImage(src, placeholder = '/placeholder-image.jpg') {
  const [imageSrc, setImageSrc] = useState(placeholder);
  
  useEffect(() => {
    // Create new image object
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
    };
    
    return () => {
      img.onload = null;
    };
  }, [src]);
  
  return imageSrc;
}

/**
 * Custom hook for debouncing function calls
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function useDebounce(fn, delay) {
  const [timeoutId, setTimeoutId] = useState(null);
  
  const debouncedFn = useCallback((...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const id = setTimeout(() => {
      fn(...args);
    }, delay);
    
    setTimeoutId(id);
  }, [fn, delay, timeoutId]);
  
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  
  return debouncedFn;
}

/**
 * Utility function to preload critical images
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  if (!Array.isArray(imageUrls)) return;
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

/**
 * Custom hook for intersection observer (lazy loading)
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject, boolean]} - Ref and whether element is visible
 */
export function useIntersectionObserver(options = {}) {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return [setRef, isVisible];
}

/**
 * Memoize expensive function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export function memoize(fn) {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
}
