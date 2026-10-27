/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        flame:  { 400: '#FB923C', 500: '#F97316', 600: '#EA580C', 700: '#C2410C' },
        sun:    { 400: '#FBBF24', 500: '#F59E0B' },
        carbon: { 950: '#0A0A0A', 900: '#0F0F0F', 800: '#1A1A1A', 700: '#262626', 600: '#3F3F3F' },
        bone:   { 50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5' }
      }
    }
  }
};
