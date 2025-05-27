import React, { useEffect } from 'react';
import { addSkipToContentLink, addAriaLandmarks, runAccessibilityAudit } from '@/lib/a11yAudit';

/**
 * A11yEnhancer Component
 * 
 * This component enhances the accessibility of your application without modifying existing components.
 * It adds important accessibility features like skip links, ARIA landmarks, and runs accessibility audits in development.
 * 
 * Usage:
 * Import and add this component at the root of your application (in App.jsx)
 */
const A11yEnhancer = ({ children }) => {
  useEffect(() => {
    // Add skip to content link
    addSkipToContentLink();
    
    // Add ARIA landmarks to improve page structure
    addAriaLandmarks();
    
    // Run accessibility audit in development
    if (process.env.NODE_ENV === 'development') {
      runAccessibilityAudit();
    }
    
    // Add event listener for keyboard navigation
    const handleFirstTab = (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    };
    
    window.addEventListener('keydown', handleFirstTab);
    
    return () => {
      window.removeEventListener('keydown', handleFirstTab);
    };
  }, []);
  
  return (
    <>
      {/* This div is for screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="a11y-announcer"
      />
      {children}
    </>
  );
};

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 */
export const announceToScreenReader = (message) => {
  if (typeof document === 'undefined') return;
  
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) {
    announcer.textContent = message;
  }
};

export default A11yEnhancer;
