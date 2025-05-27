/**
 * Accessibility Polyfill
 * 
 * This script automatically fixes common accessibility issues at runtime
 * without requiring changes to your existing code.
 */

// Run the polyfill when the DOM is fully loaded
export function initA11yPolyfill() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPolyfill);
  } else {
    runPolyfill();
  }
  
  // Also run on route changes for SPAs
  window.addEventListener('popstate', runPolyfill);
}

/**
 * Main polyfill function that fixes accessibility issues
 */
function runPolyfill() {
  setTimeout(() => {
    fixButtonsWithoutNames();
    fixLinksWithoutNames();
    fixImagesWithoutAlt();
    fixListStructure();
    fixHeadingOrder();
    addMissingLabels();
    fixContrastIssues();
    addAriaAttributes();
    
    // Set up mutation observer to handle dynamically added content
    setupMutationObserver();
  }, 500); // Small delay to ensure React has rendered
}

/**
 * Fixes buttons without accessible names
 */
function fixButtonsWithoutNames() {
  const buttons = document.querySelectorAll('button, [role="button"]');
  
  buttons.forEach(button => {
    const hasText = button.textContent.trim().length > 0;
    const hasAriaLabel = button.getAttribute('aria-label')?.trim().length > 0;
    const hasAriaLabelledBy = button.getAttribute('aria-labelledby')?.trim().length > 0;
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      // Try to infer a name from icon or context
      const icon = button.querySelector('svg, img');
      
      if (icon) {
        // Check for title or alt text on the icon
        const iconTitle = icon.querySelector('title');
        const iconAlt = icon.getAttribute('alt');
        
        if (iconTitle && iconTitle.textContent) {
          button.setAttribute('aria-label', iconTitle.textContent);
        } else if (iconAlt) {
          button.setAttribute('aria-label', iconAlt);
        } else {
          // Try to infer from parent or sibling context
          const parentHeading = button.closest('div, section').querySelector('h1, h2, h3, h4, h5, h6');
          if (parentHeading) {
            button.setAttribute('aria-label', `${parentHeading.textContent} button`);
          } else {
            // Last resort - add a generic label based on position or context
            if (button.classList.contains('close') || button.classList.contains('dismiss')) {
              button.setAttribute('aria-label', 'إغلاق');
            } else if (button.closest('header')) {
              button.setAttribute('aria-label', 'زر التنقل');
            } else {
              button.setAttribute('aria-label', 'زر');
            }
          }
        }
      } else {
        button.setAttribute('aria-label', 'زر');
      }
    }
  });
}

/**
 * Fixes links without discernible names
 */
function fixLinksWithoutNames() {
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.getAttribute('aria-label')?.trim().length > 0;
    const hasAriaLabelledBy = link.getAttribute('aria-labelledby')?.trim().length > 0;
    const hasTitle = link.getAttribute('title')?.trim().length > 0;
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      // Try to infer a name from icon, href, or context
      const icon = link.querySelector('svg, img');
      
      if (icon) {
        // Check for title or alt text on the icon
        const iconTitle = icon.querySelector('title');
        const iconAlt = icon.getAttribute('alt');
        
        if (iconTitle && iconTitle.textContent) {
          link.setAttribute('aria-label', iconTitle.textContent);
        } else if (iconAlt) {
          link.setAttribute('aria-label', iconAlt);
        } else {
          // Try to infer from href
          const href = link.getAttribute('href');
          if (href) {
            if (href.includes('whatsapp') || href.includes('wa.me')) {
              link.setAttribute('aria-label', 'واتساب');
            } else if (href.includes('facebook')) {
              link.setAttribute('aria-label', 'فيسبوك');
            } else if (href.includes('instagram')) {
              link.setAttribute('aria-label', 'انستغرام');
            } else if (href.includes('twitter')) {
              link.setAttribute('aria-label', 'تويتر');
            } else if (href.startsWith('tel:')) {
              link.setAttribute('aria-label', 'اتصل بنا');
            } else if (href.startsWith('mailto:')) {
              link.setAttribute('aria-label', 'ارسل لنا بريد إلكتروني');
            } else {
              link.setAttribute('aria-label', 'رابط');
            }
          } else {
            link.setAttribute('aria-label', 'رابط');
          }
        }
      } else {
        link.setAttribute('aria-label', 'رابط');
      }
    }
    
    // Ensure external links have proper attributes
    const href = link.getAttribute('href');
    if (href && (href.startsWith('http') || href.startsWith('https')) && !link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
      
      // If it's an external link without text, add "opens in new tab" to the aria-label
      if (link.getAttribute('target') === '_blank') {
        const currentLabel = link.getAttribute('aria-label') || 'رابط';
        link.setAttribute('aria-label', `${currentLabel} (يفتح في نافذة جديدة)`);
      }
    }
  });
}

/**
 * Fixes images without alt text
 */
function fixImagesWithoutAlt() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Check if alt attribute exists
    if (!img.hasAttribute('alt')) {
      // Try to infer alt text from context
      const parent = img.parentElement;
      
      // If image is in a link, use link text or aria-label
      if (parent.tagName === 'A') {
        const linkText = parent.textContent.trim();
        const linkAriaLabel = parent.getAttribute('aria-label');
        
        if (linkText) {
          img.alt = linkText;
        } else if (linkAriaLabel) {
          img.alt = linkAriaLabel;
        } else {
          // Try to use image filename as fallback
          const src = img.getAttribute('src');
          if (src) {
            const filename = src.split('/').pop().split('.')[0];
            img.alt = filename.replace(/[-_]/g, ' ');
          } else {
            // If all else fails, set empty alt for decorative images
            img.alt = '';
          }
        }
      } else {
        // Check if image has a figcaption
        const figure = img.closest('figure');
        if (figure) {
          const figcaption = figure.querySelector('figcaption');
          if (figcaption) {
            img.alt = figcaption.textContent.trim();
          }
        }
        
        // If still no alt, try to use image filename
        if (!img.alt) {
          const src = img.getAttribute('src');
          if (src) {
            const filename = src.split('/').pop().split('.')[0];
            img.alt = filename.replace(/[-_]/g, ' ');
          } else {
            // If all else fails, set empty alt for decorative images
            img.alt = '';
          }
        }
      }
    }
    
    // If image is decorative (empty alt), add role="presentation"
    if (img.alt === '') {
      img.setAttribute('role', 'presentation');
    }
  });
}

/**
 * Fixes list structure issues
 */
function fixListStructure() {
  const lists = document.querySelectorAll('ul, ol');
  
  lists.forEach(list => {
    const children = Array.from(list.children);
    const nonListItems = children.filter(child => 
      child.tagName !== 'LI' && 
      child.tagName !== 'SCRIPT' && 
      child.tagName !== 'TEMPLATE'
    );
    
    // If there are non-list items, wrap them in li elements
    if (nonListItems.length > 0) {
      nonListItems.forEach(item => {
        if (!item.parentNode) return; // Skip if already removed
        
        const li = document.createElement('li');
        item.parentNode.insertBefore(li, item);
        li.appendChild(item);
      });
    }
    
    // Add role="list" to ensure proper semantics
    list.setAttribute('role', 'list');
    
    // Ensure all li elements have role="listitem"
    const listItems = list.querySelectorAll('li');
    listItems.forEach(item => {
      item.setAttribute('role', 'listitem');
    });
  });
}

/**
 * Fixes heading order issues
 */
function fixHeadingOrder() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingElements = Array.from(headings);
  
  // If no headings, nothing to fix
  if (headingElements.length === 0) return;
  
  // Check if first heading is h1
  const firstHeading = headingElements[0];
  if (firstHeading.tagName !== 'H1') {
    // Add aria-level to maintain visual hierarchy but fix semantic hierarchy
    firstHeading.setAttribute('aria-level', '1');
  }
  
  // Fix skipped heading levels
  let expectedLevel = 1;
  let previousHeading = null;
  
  headingElements.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    // If heading skips a level (e.g., h1 to h3), add aria-level
    if (currentLevel > expectedLevel + 1) {
      heading.setAttribute('aria-level', String(expectedLevel + 1));
    }
    
    // Update expected level for next heading
    expectedLevel = Math.min(currentLevel, expectedLevel + 1);
    previousHeading = heading;
  });
}

/**
 * Adds missing form labels
 */
function addMissingLabels() {
  const formControls = document.querySelectorAll('input, select, textarea');
  
  formControls.forEach(control => {
    // Skip hidden inputs and inputs with existing labels
    if (control.type === 'hidden') return;
    
    const id = control.id;
    let hasLabel = false;
    
    // Check if control has an associated label
    if (id) {
      hasLabel = document.querySelector(`label[for="${id}"]`) !== null;
    }
    
    // Check if control is wrapped in a label
    if (!hasLabel) {
      hasLabel = control.closest('label') !== null;
    }
    
    // Check if control has aria-labelledby
    if (!hasLabel) {
      hasLabel = control.hasAttribute('aria-labelledby');
    }
    
    // Check if control has aria-label
    if (!hasLabel) {
      hasLabel = control.hasAttribute('aria-label');
    }
    
    // If no label found, add an aria-label based on placeholder or name
    if (!hasLabel) {
      const placeholder = control.getAttribute('placeholder');
      const name = control.getAttribute('name');
      
      if (placeholder) {
        control.setAttribute('aria-label', placeholder);
      } else if (name) {
        // Convert name to readable label (e.g., "firstName" to "First Name")
        const label = name
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
          .replace(/_/g, ' '); // Replace underscores with spaces
        
        control.setAttribute('aria-label', label);
      } else {
        // Generic label based on input type
        const type = control.type || control.tagName.toLowerCase();
        control.setAttribute('aria-label', `${type} حقل`);
      }
    }
  });
}

/**
 * Fixes contrast issues by adding high-contrast classes
 */
function fixContrastIssues() {
  // Add a high-contrast class to the body
  document.body.classList.add('a11y-high-contrast');
  
  // Add inline styles for critical text elements
  const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button, label, span');
  
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    // Only process elements with semi-transparent backgrounds
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor.includes('rgba')) {
      // Get the background color of the parent
      let parent = element.parentElement;
      let parentBgColor = 'rgba(0, 0, 0, 0)';
      
      while (parent && parentBgColor === 'rgba(0, 0, 0, 0)') {
        const parentStyle = window.getComputedStyle(parent);
        parentBgColor = parentStyle.backgroundColor;
        
        if (parentBgColor === 'rgba(0, 0, 0, 0)') {
          parent = parent.parentElement;
        }
      }
      
      // If we couldn't find a parent with a background, use the body
      if (parentBgColor === 'rgba(0, 0, 0, 0)') {
        parentBgColor = window.getComputedStyle(document.body).backgroundColor;
      }
      
      // If the color is too light on a light background, darken it
      if (isLightColor(parentBgColor) && isLightColor(color)) {
        element.style.color = '#000000';
      }
      
      // If the color is too dark on a dark background, lighten it
      if (isDarkColor(parentBgColor) && isDarkColor(color)) {
        element.style.color = '#ffffff';
      }
    }
  });
}

/**
 * Adds missing ARIA attributes to improve semantics
 */
function addAriaAttributes() {
  // Add role="navigation" to nav elements
  const navs = document.querySelectorAll('nav');
  navs.forEach(nav => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    
    // Add aria-label if missing
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'التنقل الرئيسي');
    }
  });
  
  // Add role="banner" to header
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
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
  
  // Add role="search" to search forms
  const searchForms = document.querySelectorAll('form[role="search"], form.search, form[action*="search"]');
  searchForms.forEach(form => {
    if (!form.getAttribute('role')) {
      form.setAttribute('role', 'search');
    }
  });
  
  // Add aria-current to current navigation items
  const currentLinks = document.querySelectorAll('a.active, a.current, .nav-item.active');
  currentLinks.forEach(link => {
    if (!link.getAttribute('aria-current')) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Sets up a mutation observer to handle dynamically added content
 */
function setupMutationObserver() {
  // If already set up, don't set up again
  if (window.__a11yObserver) return;
  
  const observer = new MutationObserver((mutations) => {
    let shouldRunFixes = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldRunFixes = true;
        break;
      }
    }
    
    if (shouldRunFixes) {
      fixButtonsWithoutNames();
      fixLinksWithoutNames();
      fixImagesWithoutAlt();
      fixListStructure();
      addMissingLabels();
      fixContrastIssues();
      addAriaAttributes();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
  
  window.__a11yObserver = observer;
}

/**
 * Helper function to check if a color is light
 * @param {string} color - CSS color value
 * @returns {boolean} - Whether the color is light
 */
function isLightColor(color) {
  // Convert color to RGB
  let r, g, b;
  
  if (color.startsWith('#')) {
    // Hex color
    const hex = color.substring(1);
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    // RGB or RGBA color
    const matches = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      r = parseInt(matches[1]);
      g = parseInt(matches[2]);
      b = parseInt(matches[3]);
    } else {
      return false;
    }
  } else {
    return false;
  }
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Light colors have luminance > 0.5
  return luminance > 0.5;
}

/**
 * Helper function to check if a color is dark
 * @param {string} color - CSS color value
 * @returns {boolean} - Whether the color is dark
 */
function isDarkColor(color) {
  return !isLightColor(color);
}
