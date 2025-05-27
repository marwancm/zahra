/**
 * Product Detail Page Accessibility Enhancements
 * 
 * This utility specifically enhances the accessibility of the ProductDetailPage
 * without modifying the existing code.
 */

/**
 * Enhances the accessibility of the product detail page
 * Call this function after the product detail page is rendered
 */
export function enhanceProductDetailA11y() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyEnhancements);
  } else {
    // Small delay to ensure React has rendered
    setTimeout(applyEnhancements, 500);
  }
  
  // Set up a route change listener for SPAs
  window.addEventListener('popstate', () => {
    // Check if we're on the product detail page
    if (window.location.pathname.includes('/products/')) {
      setTimeout(applyEnhancements, 500);
    }
  });
}

/**
 * Applies accessibility enhancements to the product detail page
 */
function applyEnhancements() {
  // Check if we're on a product detail page
  if (!window.location.pathname.includes('/products/')) return;
  
  fixProductImageAccessibility();
  fixProductNavigationButtons();
  enhanceProductInformation();
  fixRelatedProductsAccessibility();
}

/**
 * Fixes accessibility issues with product images
 */
function fixProductImageAccessibility() {
  // Fix main product image
  const mainImage = document.querySelector('.product-detail-page img, [class*="product-image"] img');
  if (mainImage && !mainImage.alt) {
    // Try to get product name from heading
    const productHeading = document.querySelector('h1, h2');
    if (productHeading) {
      mainImage.alt = `صورة ${productHeading.textContent.trim()}`;
    } else {
      mainImage.alt = 'صورة المنتج';
    }
  }
  
  // Fix thumbnail images
  const thumbnails = document.querySelectorAll('[class*="thumbnail"] img, [class*="thumbnails"] img');
  if (thumbnails.length > 0) {
    thumbnails.forEach((thumbnail, index) => {
      if (!thumbnail.alt) {
        // Try to get product name from heading
        const productHeading = document.querySelector('h1, h2');
        if (productHeading) {
          thumbnail.alt = `صورة مصغرة ${index + 1} لـ ${productHeading.textContent.trim()}`;
        } else {
          thumbnail.alt = `صورة مصغرة ${index + 1}`;
        }
      }
    });
  }
  
  // Add proper ARIA attributes to image gallery
  const gallery = document.querySelector('[class*="gallery"], [class*="slider"]');
  if (gallery) {
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-label', 'معرض صور المنتج');
  }
}

/**
 * Fixes accessibility issues with product navigation buttons
 */
function fixProductNavigationButtons() {
  // Fix next/previous buttons
  const nextButton = document.querySelector('[class*="next"], [class*="right"]');
  if (nextButton && !nextButton.getAttribute('aria-label')) {
    nextButton.setAttribute('aria-label', 'الصورة التالية');
  }
  
  const prevButton = document.querySelector('[class*="prev"], [class*="left"]');
  if (prevButton && !prevButton.getAttribute('aria-label')) {
    prevButton.setAttribute('aria-label', 'الصورة السابقة');
  }
  
  // Fix close button in modal/lightbox
  const closeButton = document.querySelector('[class*="close"], [class*="dismiss"]');
  if (closeButton && !closeButton.getAttribute('aria-label')) {
    closeButton.setAttribute('aria-label', 'إغلاق');
  }
  
  // Ensure buttons have proper roles
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => {
    if (!button.getAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });
}

/**
 * Enhances accessibility of product information
 */
function enhanceProductInformation() {
  // Ensure product name is in a heading
  const productName = document.querySelector('[class*="product-name"], [class*="product-title"]');
  if (productName && productName.tagName !== 'H1' && productName.tagName !== 'H2') {
    productName.setAttribute('role', 'heading');
    productName.setAttribute('aria-level', '1');
  }
  
  // Ensure price has proper semantics
  const price = document.querySelector('[class*="price"]');
  if (price) {
    price.setAttribute('aria-label', `السعر: ${price.textContent.trim()}`);
  }
  
  // Ensure description has proper semantics
  const description = document.querySelector('[class*="description"]');
  if (description) {
    description.setAttribute('aria-label', 'وصف المنتج');
  }
  
  // Add ARIA labels to badges
  const badges = document.querySelectorAll('[class*="badge"]');
  badges.forEach(badge => {
    if (!badge.getAttribute('aria-label')) {
      badge.setAttribute('aria-label', badge.textContent.trim());
    }
  });
  
  // Ensure WhatsApp button has proper accessibility
  const whatsappButton = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
  if (whatsappButton && !whatsappButton.getAttribute('aria-label')) {
    whatsappButton.setAttribute('aria-label', 'تواصل عبر واتساب');
  }
}

/**
 * Fixes accessibility issues with related products
 */
function fixRelatedProductsAccessibility() {
  // Add proper heading for related products section
  const relatedProductsSection = document.querySelector('[class*="related-products"], [class*="similar-products"]');
  if (relatedProductsSection) {
    // Check if it already has a heading
    const heading = relatedProductsSection.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) {
      // Add a visually hidden heading for screen readers
      const srHeading = document.createElement('h2');
      srHeading.textContent = 'منتجات مشابهة';
      srHeading.style.position = 'absolute';
      srHeading.style.width = '1px';
      srHeading.style.height = '1px';
      srHeading.style.padding = '0';
      srHeading.style.margin = '-1px';
      srHeading.style.overflow = 'hidden';
      srHeading.style.clip = 'rect(0, 0, 0, 0)';
      srHeading.style.whiteSpace = 'nowrap';
      srHeading.style.border = '0';
      
      relatedProductsSection.insertBefore(srHeading, relatedProductsSection.firstChild);
    }
    
    // Add proper region role
    if (!relatedProductsSection.getAttribute('role')) {
      relatedProductsSection.setAttribute('role', 'region');
      relatedProductsSection.setAttribute('aria-label', 'منتجات مشابهة');
    }
  }
  
  // Fix product cards in related products
  const productCards = document.querySelectorAll('[class*="product-card"]');
  productCards.forEach((card, index) => {
    // Add proper role
    if (!card.getAttribute('role')) {
      card.setAttribute('role', 'article');
    }
    
    // Ensure product image has alt text
    const image = card.querySelector('img');
    if (image && !image.alt) {
      const productTitle = card.querySelector('[class*="title"], [class*="name"]');
      if (productTitle) {
        image.alt = productTitle.textContent.trim();
      } else {
        image.alt = `منتج ${index + 1}`;
      }
    }
    
    // Ensure product link has proper aria-label
    const link = card.querySelector('a');
    if (link && !link.getAttribute('aria-label')) {
      const productTitle = card.querySelector('[class*="title"], [class*="name"]');
      if (productTitle) {
        link.setAttribute('aria-label', `عرض تفاصيل ${productTitle.textContent.trim()}`);
      }
    }
  });
}
