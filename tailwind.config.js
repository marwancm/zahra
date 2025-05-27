/** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ['class'],
      content: [
        './pages/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
        './app/**/*.{js,jsx}',
        './src/**/*.{js,jsx}',
      ],
      theme: {
        container: {
          center: true,
          padding: '1.5rem', 
          screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1400px',
          },
        },
        extend: {
          fontFamily: {
            sans: ['Cairo', 'sans-serif'],
            cursive: ['Ms Madi', 'cursive'],
          },
          colors: {
            border: 'hsl(var(--border))',
            input: 'hsl(var(--input))',
            ring: 'hsl(var(--ring))',
            background: 'hsl(var(--background))',
            foreground: 'hsl(var(--foreground))',
            primary: {
              DEFAULT: 'hsl(var(--primary))',
              foreground: 'hsl(var(--primary-foreground))',
            },
            secondary: {
              DEFAULT: 'hsl(var(--secondary))',
              foreground: 'hsl(var(--secondary-foreground))',
            },
            destructive: {
              DEFAULT: 'hsl(var(--destructive))',
              foreground: 'hsl(var(--destructive-foreground))',
            },
            muted: {
              DEFAULT: 'hsl(var(--muted))',
              foreground: 'hsl(var(--muted-foreground))',
            },
            accent: {
              DEFAULT: 'hsl(var(--accent))',
              foreground: 'hsl(var(--accent-foreground))',
            },
            popover: {
              DEFAULT: 'hsl(var(--popover))',
              foreground: 'hsl(var(--popover-foreground))',
            },
            card: {
              DEFAULT: 'hsl(var(--card))',
              foreground: 'hsl(var(--card-foreground))',
            },
            'brand-logo': '#a65b86',
            'brand-primary-hover': '#c07faa',
            'brand-title': '#8f436a',
            'brand-price': '#554c4f',
            'brand-footer-bg': '#554c4f', // Updated footer background color
            'brand-card-bg': '#ffffff',
            'brand-subtle-bg': '#fdf6fa',
          },
          borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 4px)',
            sm: 'calc(var(--radius) - 6px)',
          },
          boxShadow: {
            'subtle': '0 4px 12px rgba(0, 0, 0, 0.05)',
            'medium': '0 8px 24px rgba(143, 67, 106, 0.1)',
            'strong': '0 12px 36px rgba(143, 67, 106, 0.15)',
          },
          keyframes: {
            'accordion-down': {
              from: { height: '0' },
              to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
              from: { height: 'var(--radix-accordion-content-height)' },
              to: { height: '0' },
            },
            'fadeIn': {
              '0%': { opacity: '0', transform: 'translateY(10px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            'pulse-subtle': {
              '0%, 100%': { opacity: '1' },
              '50%': { opacity: '.7' },
            }
          },
          animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
            'fadeIn': 'fadeIn 0.5s ease-out forwards',
            'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
        },
      },
      plugins: [require('tailwindcss-animate')],
    };