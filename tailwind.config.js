/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#06070a',
          900: '#0a0c12',
          800: '#10131c',
          700: '#181c28',
          600: '#262b3a',
        },
        brand: {
          DEFAULT: '#7c5cff',
          50: '#f3f0ff',
          400: '#9d83ff',
          500: '#7c5cff',
          600: '#5a3aff',
        },
        accent: {
          mint: '#5eead4',
          pink: '#f472b6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at top, rgba(124,92,255,0.10), transparent 60%)',
      },
    },
  },
  plugins: [],
};
