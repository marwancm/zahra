import React, { memo, lazy, Suspense } from 'react';

/**
 * Memoizes a component to prevent unnecessary re-renders
 * @param {React.ComponentType} Component - The component to memoize
 * @param {Function} propsAreEqual - Optional comparison function for props
 * @returns {React.MemoExoticComponent} Memoized component
 */
export const memoize = (Component, propsAreEqual) => {
  return memo(Component, propsAreEqual);
};

/**
 * Creates a lazy-loaded component with a fallback
 * @param {Function} importFunc - Import function that returns a promise
 * @param {React.ReactNode} fallback - Fallback UI while loading
 * @returns {React.LazyExoticComponent} Lazy loaded component
 */
export const lazyLoad = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Creates an optimized image URL with width and quality parameters
 * @param {string} url - Original image URL
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized image URL
 */
export const optimizeImageUrl = (url, width = 400, quality = 80) => {
  if (!url) return '';
  
  // For external URLs that support image optimization (like Cloudinary, Imgix, etc.)
  if (url.includes('cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality}/`);
  }
  
  // For local images, just return the original URL
  return url;
};

/**
 * Throttles a function call
 * @param {Function} func - The function to throttle
 * @param {number} limit - Throttle time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
