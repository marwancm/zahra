/**
 * Accessibility Audit Tool
 * 
 * This utility helps identify accessibility issues in your application
 * and provides suggestions for fixing them without modifying existing code.
 */

/**
 * Runs when the DOM is loaded to check for common accessibility issues
 */
export function runAccessibilityAudit() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') return;
  
  // Wait for DOM to be fully loaded
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      console.group('🔍 Accessibility Audit');
      
      checkButtonsWithoutNames();
      checkLinksWithoutNames();
      checkContrastIssues();
      checkListStructure();
      checkHeadingOrder();
      
      console.groupEnd();
    }, 1000); // Delay to ensure React has rendered
  });
}

/**
 * Checks for buttons without accessible names
 */
function checkButtonsWithoutNames() {
  const buttons = document.querySelectorAll('button, [role="button"]');
  const issueButtons = Array.from(buttons).filter(button => {
    const hasText = button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label')?.trim().length > 0;
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby')?.trim().length > 0;
    
    return !hasText && !hasAriaLabel && !hasAriaLabelledBy;
  });
  
  if (issueButtons.length > 0) {
    console.warn(`⚠️ Found ${issueButtons.length} buttons without accessible names`);
    console.log('Fix by adding text content, aria-label, or aria-labelledby attributes to these buttons:');
    issueButtons.forEach((button, index) => {
      // Add a visual indicator
      button.classList.add('a11y-warning');
      console.log(`${index + 1}. ${button.outerHTML.slice(0, 100)}${button.outerHTML.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log('✅ All buttons have accessible names');
  }
}

/**
 * Checks for links without discernible names
 */
function checkLinksWithoutNames() {
  const links = document.querySelectorAll('a');
  const issueLinks = Array.from(links).filter(link => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label')?.trim().length > 0;
    const hasAriaLabelledBy = link.getAttribute('aria-labelledby')?.trim().length > 0;
    const hasTitle = link.getAttribute('title')?.trim().length > 0;
    
    return !hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle;
  });
  
  if (issueLinks.length > 0) {
    console.warn(`⚠️ Found ${issueLinks.length} links without discernible names`);
    console.log('Fix by adding text content, aria-label, or aria-labelledby attributes to these links:');
    issueLinks.forEach((link, index) => {
      // Add a visual indicator
      link.classList.add('a11y-warning');
      console.log(`${index + 1}. ${link.outerHTML.slice(0, 100)}${link.outerHTML.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log('✅ All links have discernible names');
  }
}

/**
 * Checks for contrast issues
 */
function checkContrastIssues() {
  // This is a simplified check - a full check would require computing styles
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label');
  
  console.log('⚠️ Contrast check: Manual review required');
  console.log('Use the a11y.js utility functions to check contrast ratios for text elements');
  console.log('Example: import { getContrastRatio } from "@/lib/a11y"');
}

/**
 * Checks for proper list structure
 */
function checkListStructure() {
  const lists = document.querySelectorAll('ul, ol');
  const invalidLists = Array.from(lists).filter(list => {
    const children = Array.from(list.children);
    return children.some(child => 
      child.tagName !== 'LI' && 
      child.tagName !== 'SCRIPT' && 
      child.tagName !== 'TEMPLATE'
    );
  });
  
  if (invalidLists.length > 0) {
    console.warn(`⚠️ Found ${invalidLists.length} lists with invalid structure`);
    console.log('Lists should only contain <li>, <script>, or <template> elements:');
    invalidLists.forEach((list, index) => {
      // Add a visual indicator
      list.classList.add('a11y-warning');
      console.log(`${index + 1}. ${list.outerHTML.slice(0, 100)}${list.outerHTML.length > 100 ? '...' : ''}`);
    });
  } else {
    console.log('✅ All lists have proper structure');
  }
}

/**
 * Checks for proper heading order
 */
function checkHeadingOrder() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = Array.from(headings).map(heading => 
    parseInt(heading.tagName.charAt(1))
  );
  
  let hasOrderIssue = false;
  let previousLevel = 0;
  
  for (let i = 0; i < headingLevels.length; i++) {
    const currentLevel = headingLevels[i];
    
    // First heading should be h1
    if (i === 0 && currentLevel !== 1) {
      hasOrderIssue = true;
      console.warn('⚠️ First heading is not an h1');
      headings[i].classList.add('a11y-warning');
    }
    
    // Heading levels should not skip (e.g., h1 to h3)
    if (previousLevel > 0 && currentLevel > previousLevel && currentLevel - previousLevel > 1) {
      hasOrderIssue = true;
      console.warn(`⚠️ Heading level skipped from h${previousLevel} to h${currentLevel}`);
      headings[i].classList.add('a11y-warning');
    }
    
    previousLevel = currentLevel;
  }
  
  if (!hasOrderIssue) {
    console.log('✅ Heading order is correct');
  } else {
    console.log('Fix heading order by ensuring they follow a sequential order (h1 → h2 → h3)');
  }
}

/**
 * Adds a skip to content link at the top of the page
 */
export function addSkipToContentLink() {
  if (typeof document === 'undefined') return;
  
  // Check if it already exists
  if (document.querySelector('.skip-to-content')) return;
  
  // Create the link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = 'تخطي إلى المحتوى الرئيسي';
  
  // Add to the beginning of the body
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure main content has an id
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main';
  }
}

/**
 * Adds ARIA landmarks to improve page structure
 */
export function addAriaLandmarks() {
  if (typeof document === 'undefined') return;
  
  // Add role="banner" to header
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Add role="navigation" to nav
  const nav = document.querySelector('nav');
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
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
}
