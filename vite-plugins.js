// Vite plugins for JavaScript optimization
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

/**
 * Custom plugin to remove unused code
 */
export function removeUnusedCode() {
  return {
    name: 'remove-unused-code',
    transform(code, id) {
      // Only process JavaScript files
      if (!id.match(/\.[jt]sx?$/)) return null;
      
      // Remove console.log statements in production
      if (process.env.NODE_ENV === 'production') {
        code = code.replace(/console\.log\(.*?\);?/g, '');
      }
      
      return {
        code,
        map: null
      };
    }
  };
}

/**
 * Bundle analyzer plugin configuration
 */
export function bundleAnalyzer() {
  return visualizer({
    filename: './dist/stats.html',
    open: false,
    gzipSize: true,
    brotliSize: true,
  });
}

/**
 * Get optimized Vite configuration for production
 */
export function getOptimizedConfig() {
  return defineConfig({
    build: {
      target: 'es2015',
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react', 
              'react-dom', 
              'react-router-dom'
            ],
            animations: ['framer-motion'],
            ui: [
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-slider',
              '@radix-ui/react-slot',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast'
            ],
          },
          // Prevent duplicate chunks
          chunkFileNames: (chunkInfo) => {
            const id = chunkInfo.facadeModuleId || '';
            if (id.includes('node_modules')) {
              const name = id.toString().split('node_modules/')[1].split('/')[0].replace('@', '');
              return `assets/vendor-${name}-[hash].js`;
            }
            return 'assets/[name]-[hash].js';
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      },
    },
    plugins: [
      removeUnusedCode(),
      bundleAnalyzer(),
    ],
  });
}
