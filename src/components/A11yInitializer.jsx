import React, { useEffect, useState } from 'react';
import { initA11yPolyfill } from '@/lib/a11yPolyfill';
import '@/lib/a11y-high-contrast.css';

/**
 * A11yInitializer Component
 * 
 * This component automatically applies accessibility improvements to your application
 * without requiring changes to your existing code.
 * 
 * Usage:
 * Import and add this component at the root of your application (in App.jsx)
 * <A11yInitializer />
 */
const A11yInitializer = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  
  useEffect(() => {
    // Initialize the accessibility polyfill
    initA11yPolyfill();
    
    // Check for saved preferences
    const savedHighContrast = localStorage.getItem('a11y-high-contrast') === 'true';
    const savedLargeText = localStorage.getItem('a11y-large-text') === 'true';
    
    if (savedHighContrast) {
      setHighContrast(true);
      document.body.classList.add('a11y-high-contrast');
    }
    
    if (savedLargeText) {
      setLargeText(true);
      document.body.classList.add('a11y-large-text');
    }
    
    // Add skip to content link
    addSkipToContentLink();
    
    // Add ARIA landmarks
    addAriaLandmarks();
    
    return () => {
      // Clean up
      const skipLink = document.querySelector('.a11y-skip-to-content');
      if (skipLink) {
        skipLink.remove();
      }
    };
  }, []);
  
  /**
   * Adds a skip to content link
   */
  const addSkipToContentLink = () => {
    // Check if it already exists
    if (document.querySelector('.a11y-skip-to-content')) return;
    
    // Create the link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'a11y-skip-to-content';
    skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
    
    // Style the link
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '0';
    skipLink.style.backgroundColor = '#0057b7';
    skipLink.style.color = '#ffffff';
    skipLink.style.padding = '8px';
    skipLink.style.zIndex = '9999';
    skipLink.style.transition = 'top 0.3s';
    
    // Add focus styles
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    // Add to the beginning of the body
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has an id
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main';
    }
  };
  
  /**
   * Adds ARIA landmarks to improve page structure
   */
  const addAriaLandmarks = () => {
    // Add role="banner" to header
    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    // Add role="navigation" to nav
    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      
      // Add aria-label if missing
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', 'التنقل الرئيسي');
      }
    }
    
    // Add role="main" to main
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }
    
    // Add role="contentinfo" to footer
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  };
  
  /**
   * Toggles high contrast mode
   */
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    if (newValue) {
      document.body.classList.add('a11y-high-contrast');
    } else {
      document.body.classList.remove('a11y-high-contrast');
    }
    
    localStorage.setItem('a11y-high-contrast', String(newValue));
  };
  
  /**
   * Toggles large text mode
   */
  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    
    if (newValue) {
      document.body.classList.add('a11y-large-text');
      document.body.style.fontSize = '120%';
    } else {
      document.body.classList.remove('a11y-large-text');
      document.body.style.fontSize = '';
    }
    
    localStorage.setItem('a11y-large-text', String(newValue));
  };
  
  // Add accessibility controls
  useEffect(() => {
    // Check if controls already exist
    if (document.querySelector('.a11y-controls')) return;
    
    // Create controls container
    const controls = document.createElement('div');
    controls.className = 'a11y-controls';
    controls.setAttribute('role', 'region');
    controls.setAttribute('aria-label', 'خيارات إمكانية الوصول');
    
    // Style the controls
    controls.style.position = 'fixed';
    controls.style.bottom = '20px';
    controls.style.right = '20px';
    controls.style.zIndex = '9999';
    controls.style.display = 'flex';
    controls.style.flexDirection = 'column';
    controls.style.gap = '10px';
    
    // Create high contrast button
    const contrastButton = document.createElement('button');
    contrastButton.textContent = 'تباين عالي';
    contrastButton.setAttribute('aria-pressed', String(highContrast));
    contrastButton.style.padding = '8px 12px';
    contrastButton.style.backgroundColor = highContrast ? '#0057b7' : '#f0f0f0';
    contrastButton.style.color = highContrast ? '#ffffff' : '#000000';
    contrastButton.style.border = '1px solid #000000';
    contrastButton.style.borderRadius = '4px';
    contrastButton.style.cursor = 'pointer';
    
    contrastButton.addEventListener('click', () => {
      toggleHighContrast();
      contrastButton.setAttribute('aria-pressed', String(!highContrast));
      contrastButton.style.backgroundColor = !highContrast ? '#0057b7' : '#f0f0f0';
      contrastButton.style.color = !highContrast ? '#ffffff' : '#000000';
    });
    
    // Create large text button
    const textButton = document.createElement('button');
    textButton.textContent = 'نص كبير';
    textButton.setAttribute('aria-pressed', String(largeText));
    textButton.style.padding = '8px 12px';
    textButton.style.backgroundColor = largeText ? '#0057b7' : '#f0f0f0';
    textButton.style.color = largeText ? '#ffffff' : '#000000';
    textButton.style.border = '1px solid #000000';
    textButton.style.borderRadius = '4px';
    textButton.style.cursor = 'pointer';
    
    textButton.addEventListener('click', () => {
      toggleLargeText();
      textButton.setAttribute('aria-pressed', String(!largeText));
      textButton.style.backgroundColor = !largeText ? '#0057b7' : '#f0f0f0';
      textButton.style.color = !largeText ? '#ffffff' : '#000000';
    });
    
    // Add buttons to controls
    controls.appendChild(contrastButton);
    controls.appendChild(textButton);
    
    // Add controls to body
    document.body.appendChild(controls);
    
    return () => {
      // Clean up
      if (controls.parentNode) {
        controls.parentNode.removeChild(controls);
      }
    };
  }, [highContrast, largeText]);
  
  // This component doesn't render anything visible
  return null;
};

export default A11yInitializer;
