/**
 * Image utility functions for optimizing image loading and display
 */

/**
 * Generates a responsive image srcset based on the original image URL
 * @param {string} imageUrl - The original image URL
 * @param {Array<number>} sizes - Array of image widths to generate
 * @param {string} format - Image format (webp, avif, etc.)
 * @returns {string} - The srcset attribute string
 */
export function generateSrcSet(imageUrl, sizes = [640, 1024, 1600], format = 'webp') {
  if (!imageUrl) return '';
  
  // For production optimized images
  if (imageUrl.startsWith('/optimized/')) {
    const baseName = imageUrl.split('.')[0];
    return sizes
      .map(size => `${baseName}-${size}.${format} ${size}w`)
      .join(', ');
  }
  
  // For original images, you can use this when you implement the image optimizer
  const fileName = imageUrl.split('/').pop();
  const baseName = fileName.split('.')[0];
  const optimizedPath = `/optimized/${baseName}`;
  
  return sizes
    .map(size => `${optimizedPath}-${size}.${format} ${size}w`)
    .join(', ');
}

/**
 * Determines the appropriate image size based on the display size
 * @param {number} displayWidth - The width the image will be displayed at
 * @returns {string} - The sizes attribute string
 */
export function getImageSizes(displayWidth) {
  if (displayWidth < 640) {
    return '100vw';
  } else if (displayWidth < 1024) {
    return '50vw';
  } else {
    return `${displayWidth}px`;
  }
}

/**
 * Checks if WebP format is supported by the browser
 * @returns {boolean} - Whether WebP is supported
 */
export function supportsWebP() {
  if (typeof window === 'undefined') return false;
  
  const elem = document.createElement('canvas');
  if (elem.getContext && elem.getContext('2d')) {
    // WebP support check
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Gets the best supported image format for the current browser
 * @returns {string} - The best supported format
 */
export function getBestImageFormat() {
  // This is a simplified version - in a real implementation,
  // you would check for AVIF support as well
  return supportsWebP() ? 'webp' : 'jpg';
}

/**
 * Calculates the appropriate image dimensions to request based on
 * the display size and device pixel ratio
 * @param {number} width - The display width
 * @param {number} height - The display height
 * @returns {Object} - The calculated dimensions
 */
export function calculateImageDimensions(width, height) {
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  
  return {
    width: Math.round(width * pixelRatio),
    height: Math.round(height * pixelRatio)
  };
}

/**
 * Creates an optimized image URL for a given source
 * @param {string} src - The original image source
 * @param {Object} options - Options for optimization
 * @returns {string} - The optimized image URL
 */
export function getOptimizedImageUrl(src, options = {}) {
  const { width, height, quality = 80, format = 'auto' } = options;
  
  if (!src) return '';
  
  // For external image optimization services
  if (src.includes('cloudinary.com')) {
    let transformations = 'f_auto,q_auto';
    
    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;
    
    return src.replace('/upload/', `/upload/${transformations}/`);
  }
  
  // For local images, when you implement the image optimizer
  if (src.startsWith('/') && !src.startsWith('/optimized/')) {
    const fileName = src.split('/').pop();
    const baseName = fileName.split('.')[0];
    const extension = format === 'auto' ? getBestImageFormat() : format;
    
    if (width) {
      return `/optimized/${baseName}-${width}.${extension}`;
    }
    
    return `/optimized/${baseName}.${extension}`;
  }
  
  return src;
}
