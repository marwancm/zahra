/**
 * Accessibility (a11y) utilities to enhance the accessibility of your React application
 * without modifying existing components.
 */

import React from 'react';

/**
 * Enhances a button element with proper accessibility attributes
 * @param {Object} props - The original button props
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceButtonA11y(props) {
  const { children, onClick, className, style, ...rest } = props;
  
  // Determine if the button has a discernible name
  const hasText = typeof children === 'string' && children.trim().length > 0;
  const hasAriaLabel = rest['aria-label'] && rest['aria-label'].trim().length > 0;
  
  // If no discernible name, add a warning class in development
  const enhancedClassName = !hasText && !hasAriaLabel 
    ? `${className || ''} a11y-warning`
    : className;
  
  return {
    ...rest,
    children,
    onClick,
    className: enhancedClassName,
    style,
    // Ensure button has a role
    role: rest.role || 'button',
    // Ensure keyboard accessibility
    tabIndex: rest.tabIndex || 0,
    // Add keyboard event handler if onClick is provided
    onKeyDown: (e) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick(e);
      }
      // Call original onKeyDown if it exists
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    },
  };
}

/**
 * Enhances a link element with proper accessibility attributes
 * @param {Object} props - The original link props
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceLinkA11y(props) {
  const { children, href, className, style, ...rest } = props;
  
  // Determine if the link has a discernible name
  const hasText = typeof children === 'string' && children.trim().length > 0;
  const hasAriaLabel = rest['aria-label'] && rest['aria-label'].trim().length > 0;
  
  // If no discernible name, add a warning class in development
  const enhancedClassName = !hasText && !hasAriaLabel 
    ? `${className || ''} a11y-warning`
    : className;
  
  return {
    ...rest,
    children,
    href,
    className: enhancedClassName,
    style,
    // Ensure external links have proper attributes
    ...(href && href.startsWith('http') ? {
      rel: 'noopener noreferrer',
      target: '_blank',
      'aria-label': rest['aria-label'] || `${hasText ? children : 'Link'} (opens in new tab)`,
    } : {}),
  };
}

/**
 * Enhances an image element with proper accessibility attributes
 * @param {Object} props - The original image props
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceImageA11y(props) {
  const { alt, src, className, style, ...rest } = props;
  
  // Determine if the image needs alt text
  const hasAlt = alt !== undefined;
  
  // If no alt attribute, add a warning class in development
  const enhancedClassName = !hasAlt
    ? `${className || ''} a11y-warning`
    : className;
  
  return {
    ...rest,
    src,
    className: enhancedClassName,
    style,
    // Ensure alt is defined (empty string for decorative images)
    alt: hasAlt ? alt : '',
    // If image is decorative (empty alt), add role="presentation"
    ...(alt === '' ? { role: 'presentation' } : {}),
  };
}

/**
 * Enhances a list element with proper accessibility attributes
 * @param {Object} props - The original list props
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceListA11y(props) {
  const { children, className, style, ...rest } = props;
  
  return {
    ...rest,
    children,
    className,
    style,
    // Ensure list has proper role
    role: rest.role || 'list',
  };
}

/**
 * Enhances a list item element with proper accessibility attributes
 * @param {Object} props - The original list item props
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceListItemA11y(props) {
  const { children, className, style, ...rest } = props;
  
  return {
    ...rest,
    children,
    className,
    style,
    // Ensure list item has proper role
    role: rest.role || 'listitem',
  };
}

/**
 * Enhances a heading element with proper accessibility attributes
 * @param {Object} props - The original heading props
 * @param {number} level - The heading level (1-6)
 * @returns {Object} - Enhanced props with accessibility attributes
 */
export function enhanceHeadingA11y(props, level = 1) {
  const { children, className, style, ...rest } = props;
  
  // Ensure level is between 1 and 6
  const validLevel = Math.max(1, Math.min(6, level));
  
  return {
    ...rest,
    children,
    className,
    style,
    // Ensure heading has proper role
    role: rest.role || 'heading',
    'aria-level': rest['aria-level'] || validLevel,
  };
}

/**
 * Checks contrast ratio between foreground and background colors
 * @param {string} foreground - Foreground color in hex format
 * @param {string} background - Background color in hex format
 * @returns {number} - Contrast ratio
 */
export function getContrastRatio(foreground, background) {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };
  
  // Calculate relative luminance
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.map((c) => {
      const channel = c / 255;
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const foregroundRgb = hexToRgb(foreground);
  const backgroundRgb = hexToRgb(background);
  
  const foregroundLuminance = getLuminance(foregroundRgb);
  const backgroundLuminance = getLuminance(backgroundRgb);
  
  // Calculate contrast ratio
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG contrast requirements
 * @param {string} foreground - Foreground color in hex format
 * @param {string} background - Background color in hex format
 * @param {string} level - 'AA' or 'AAA'
 * @param {string} size - 'large' or 'normal'
 * @returns {boolean} - Whether the contrast meets requirements
 */
export function meetsContrastRequirements(foreground, background, level = 'AA', size = 'normal') {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Suggests a color with better contrast against a background
 * @param {string} color - Original color in hex format
 * @param {string} background - Background color in hex format
 * @param {string} level - 'AA' or 'AAA'
 * @returns {string} - Suggested color with better contrast
 */
export function suggestBetterContrastColor(color, background, level = 'AA') {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const formattedHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(formattedHex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };
  
  // Convert RGB to hex
  const rgbToHex = (rgb) => {
    return '#' + rgb.map(c => {
      const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  const targetRatio = level === 'AAA' ? 7 : 4.5;
  const originalRgb = hexToRgb(color);
  const backgroundRgb = hexToRgb(background);
  
  // Calculate brightness
  const getBrightness = (rgb) => {
    return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  };
  
  const backgroundBrightness = getBrightness(backgroundRgb);
  
  // Determine if we should darken or lighten the color
  const shouldDarken = backgroundBrightness > 128;
  
  // Start with the original color
  let adjustedRgb = [...originalRgb];
  let ratio = getContrastRatio(rgbToHex(adjustedRgb), background);
  
  // Adjust the color until we meet the target ratio
  while (ratio < targetRatio) {
    if (shouldDarken) {
      // Darken the color
      adjustedRgb = adjustedRgb.map(c => Math.max(0, c - 5));
    } else {
      // Lighten the color
      adjustedRgb = adjustedRgb.map(c => Math.min(255, c + 5));
    }
    
    ratio = getContrastRatio(rgbToHex(adjustedRgb), background);
    
    // Break if we've reached the extremes
    if (
      (shouldDarken && adjustedRgb.every(c => c === 0)) ||
      (!shouldDarken && adjustedRgb.every(c => c === 255))
    ) {
      break;
    }
  }
  
  return rgbToHex(adjustedRgb);
}
