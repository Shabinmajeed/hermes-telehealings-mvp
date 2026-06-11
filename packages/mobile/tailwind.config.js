/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF5FF',
          100: '#D9E8FF',
          200: '#BCD7FF',
          300: '#8EBEFF',
          400: '#599BFF',
          500: '#3378FF',
          600: '#1B57F5',
          700: '#1443E1',
          800: '#1736B6',
          900: '#19328F',
          950: '#142057',
        },
        accent: '#3378FF',
        surface: '#FFFFFF',
        'surface-secondary': '#F8F9FC',
        'surface-tertiary': '#EEF0F5',
        text: '#1A1D26',
        'text-secondary': '#6B7280',
        'text-tertiary': '#9CA3AF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'System'],
        medium: ['Inter-Medium', 'System'],
        semibold: ['Inter-SemiBold', 'System'],
        bold: ['Inter-Bold', 'System'],
      },
    },
  },
  plugins: [],
};
