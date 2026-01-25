/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Colors - muted, non-overstimulating palette for children
      colors: {
        // Primary palette
        primary: {
          DEFAULT: '#6B9AE8',
          50: '#F0F5FD',
          100: '#E1EBFB',
          200: '#C3D7F7',
          300: '#A5C3F3',
          400: '#87AFEF',
          500: '#6B9AE8',
          600: '#4A7FD9',
          700: '#3366BA',
          800: '#264D8C',
          900: '#1A345E',
        },
        // Secondary - warm orange for "try again", NOT errors
        secondary: {
          DEFAULT: '#E8927C',
          50: '#FDF5F3',
          100: '#FBEBE7',
          200: '#F7D7CF',
          300: '#F3C3B7',
          400: '#EFAF9F',
          500: '#E8927C',
          600: '#D9735A',
          700: '#C45A40',
          800: '#9A4632',
          900: '#703324',
        },
        // Success - soft green
        success: {
          DEFAULT: '#7EC88B',
          50: '#F2FAF4',
          100: '#E5F5E9',
          200: '#CCEBD3',
          300: '#B2E1BD',
          400: '#99D7A7',
          500: '#7EC88B',
          600: '#5CB86F',
          700: '#46A259',
          800: '#357D44',
          900: '#24572F',
        },
        // Background - warm off-white, never pure white
        background: {
          DEFAULT: '#F8F6F0',
          warm: '#F8F6F0',
          cream: '#FDF9F3',
          paper: '#FFFEF9',
        },
        // Text - soft charcoal
        text: {
          DEFAULT: '#2D3748',
          primary: '#2D3748',
          secondary: '#4A5568',
          muted: '#718096',
          light: '#A0AEC0',
        },
        // Accent colors for base-10 blocks
        blocks: {
          unit: '#64B5C6', // Soft teal for unit cubes
          ten: '#A78BCA', // Soft purple for ten rods
          hundred: '#E8A07C', // Soft coral for hundred flats
        },
        // Additional UI colors
        warning: {
          DEFAULT: '#F6C863',
          light: '#FBE8B8',
        },
        error: {
          DEFAULT: '#E57373',
          light: '#FFCDD2',
        },
      },

      // Typography - child-friendly with Nunito font
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Nunito', 'system-ui', 'sans-serif'],
        math: ['Nunito', 'system-ui', 'sans-serif'],
      },

      // Font sizes - larger for children (base 18-24px)
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['18px', { lineHeight: '28px' }], // Default for children
        lg: ['24px', { lineHeight: '32px' }],
        xl: ['32px', { lineHeight: '40px' }],
        '2xl': ['40px', { lineHeight: '48px' }],
        '3xl': ['56px', { lineHeight: '64px' }], // For large math numbers
        // Math-specific sizes
        'math-sm': ['24px', { lineHeight: '32px' }],
        math: ['32px', { lineHeight: '40px' }],
        'math-lg': ['40px', { lineHeight: '48px' }],
        'math-xl': ['56px', { lineHeight: '64px' }],
      },

      // Font weights
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },

      // Spacing - generous for touch targets
      spacing: {
        touch: '48px', // Minimum touch target
        'touch-lg': '64px', // Recommended for children
        content: '16px', // Content padding
        'content-lg': '24px', // Larger content padding
        gap: '12px', // Gap between elements
        'gap-lg': '16px', // Larger gap
      },

      // Border radius - rounded, friendly shapes
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },

      // Box shadows - subtle for depth, not harsh
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        soft: '0 2px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        medium: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
        lift: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 20px rgba(107, 154, 232, 0.3)',
        'glow-success': '0 0 20px rgba(126, 200, 139, 0.3)',
        'glow-secondary': '0 0 20px rgba(232, 146, 124, 0.3)',
      },

      // Animation durations
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },

      // Animation timing functions
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Custom animations for children's feedback
      animation: {
        'bounce-gentle': 'bounceGentle 0.5s ease-in-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        pop: 'pop 0.3s ease-out',
        celebrate: 'celebrate 0.6s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
      },

      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        celebrate: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.15) rotate(2deg)' },
          '75%': { transform: 'scale(1.1) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },

      // Min height/width for touch targets
      minHeight: {
        touch: '48px',
        'touch-lg': '64px',
      },
      minWidth: {
        touch: '48px',
        'touch-lg': '64px',
      },
    },
  },
  plugins: [],
};
