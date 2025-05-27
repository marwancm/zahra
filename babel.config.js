module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
        // This setting helps avoid transpiling ES modules to CommonJS
        modules: false,
        // Only include polyfills for features actually used in the code
        useBuiltIns: 'usage',
        corejs: 3,
        // Exclude legacy transforms for modern browsers
        exclude: [
          'transform-regenerator',
          'transform-async-to-generator',
        ],
      },
    ],
    [
      '@babel/preset-react',
      {
        // Use the new JSX transform from React 17+
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    // Remove PropTypes in production
    ['transform-react-remove-prop-types', { removeImport: true }],
  ],
  env: {
    production: {
      // Additional production-only plugins
      plugins: [
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
      ],
    },
  },
};
