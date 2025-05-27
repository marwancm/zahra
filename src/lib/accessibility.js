/**
 * Accessibility utilities for improving application accessibility
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for managing focus trapping within a modal or dialog
 * @param {boolean} isActive - Whether focus trap is active
 * @returns {React.RefObject} - Ref to attach to the container element
 */
export function useFocusTrap(isActive = true) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    // Set initial focus
    firstElement.focus();
    
    // Add event listener
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  return containerRef;
}

/**
 * Custom hook for handling Escape key press
 * @param {Function} callback - Function to call when Escape is pressed
 * @param {boolean} isActive - Whether the listener is active
 */
export function useEscapeKey(callback, isActive = true) {
  useEffect(() => {
    if (!isActive) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback, isActive]);
}

/**
 * Custom hook for announcing messages to screen readers
 * @returns {Function} - Function to announce message
 */
export function useAnnounce() {
  const [announceMessage, setAnnounceMessage] = useState('');
  
  useEffect(() => {
    if (!announceMessage) return;
    
    // Clear announcement after screen readers have time to announce it
    const timeoutId = setTimeout(() => {
      setAnnounceMessage('');
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [announceMessage]);
  
  const announce = useCallback((message, priority = 'polite') => {
    setAnnounceMessage(message);
  }, []);
  
  return {
    announce,
    announceMessage,
    AriaLiveRegion: () => (
      <>
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {announceMessage}
        </div>
      </>
    )
  };
}

/**
 * Creates an accessible image with proper alt text
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Accessible image component
 */
export function AccessibleImage({ src, alt, decorative = false, ...props }) {
  const altText = decorative ? '' : alt;
  const ariaHidden = decorative ? true : undefined;
  
  return (
    <img 
      src={src} 
      alt={altText} 
      aria-hidden={ariaHidden}
      {...props} 
    />
  );
}

/**
 * Skip to content link component for keyboard users
 * @param {Object} props - Component props
 * @returns {JSX.Element} - Skip link component
 */
export function SkipToContent({ targetId = 'main-content', ...props }) {
  return (
    <a 
      href={`#${targetId}`} 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    >
      تخطي إلى المحتوى الرئيسي
    </a>
  );
}

/**
 * Utility to check color contrast ratio
 * @param {string} foreground - Foreground color in hex format
 * @param {string} background - Background color in hex format
 * @returns {number} - Contrast ratio
 */
export function getContrastRatio(foreground, background) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };
  
  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const foregroundRgb = hexToRgb(foreground);
  const backgroundRgb = hexToRgb(background);
  
  const foregroundLuminance = getLuminance(foregroundRgb);
  const backgroundLuminance = getLuminance(backgroundRgb);
  
  const ratio = foregroundLuminance > backgroundLuminance 
    ? (foregroundLuminance + 0.05) / (backgroundLuminance + 0.05)
    : (backgroundLuminance + 0.05) / (foregroundLuminance + 0.05);
  
  return ratio;
}
