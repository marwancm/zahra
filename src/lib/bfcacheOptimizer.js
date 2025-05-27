/**
 * BFCache (Back/Forward Cache) Optimizer
 * 
 * This utility helps optimize your application for back/forward cache compatibility,
 * which allows instant page loads when navigating with browser back/forward buttons.
 */

/**
 * Initialize BFCache optimization
 * Call this function in your main application component
 */
export function initBFCacheOptimizer() {
  if (typeof window === 'undefined') return;

  // Listen for page show events (when page is shown after being in BFCache)
  window.addEventListener('pageshow', (event) => {
    // If the page was restored from BFCache
    if (event.persisted) {
      // Force a refresh of dynamic content
      dispatchBFCacheRestoreEvent();
    }
  });

  // Avoid using unload event which prevents BFCache
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Do cleanup here instead of using beforeunload/unload
      cleanupBeforeHiding();
    }
  });

  // Remove listeners that use unload or beforeunload
  removeUnloadListeners();
}

/**
 * Dispatch a custom event when the page is restored from BFCache
 */
function dispatchBFCacheRestoreEvent() {
  const event = new CustomEvent('bfcacheRestore', { 
    detail: { timestamp: Date.now() } 
  });
  window.dispatchEvent(event);
}

/**
 * Clean up resources before page is hidden
 * This is a better alternative to beforeunload/unload
 */
function cleanupBeforeHiding() {
  // Close any open connections
  // This is a good place to close WebSockets, IndexedDB connections, etc.
}

/**
 * Remove any existing unload or beforeunload listeners
 * These events prevent BFCache from working
 */
function removeUnloadListeners() {
  // Create empty event handlers to prevent other code from adding them
  window.addEventListener('beforeunload', (e) => {}, { capture: true });
  window.addEventListener('unload', (e) => {}, { capture: true });
}

/**
 * Add a listener for BFCache restore events
 * @param {Function} callback - Function to call when page is restored from BFCache
 * @returns {Function} - Function to remove the listener
 */
export function onBFCacheRestore(callback) {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event) => {
    callback(event.detail);
  };
  
  window.addEventListener('bfcacheRestore', handler);
  
  return () => {
    window.removeEventListener('bfcacheRestore', handler);
  };
}

/**
 * Check if the current page supports BFCache
 * @returns {boolean} - Whether BFCache is supported
 */
export function isBFCacheSupported() {
  // Check for features that might prevent BFCache
  const hasPreventingFeatures = [
    // Check for unload listeners
    window.onunload !== null || window.onbeforeunload !== null,
    
    // Check for service worker
    'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
    
    // Check for open IndexedDB connections
    'indexedDB' in window && Object.keys(indexedDB).length > 0,
    
    // Check for open WebSocket connections
    'WebSocket' in window && document.querySelectorAll('iframe').length > 0
  ].some(Boolean);
  
  return !hasPreventingFeatures;
}
