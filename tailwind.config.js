/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#18181B',
        'dimmer-dark-bg': '#1A1A1E',
        'card-bg': '#1D1D29',
        'primary-button': '#1F1F56',
        'primary-button-hover': '#29297F',
        'main-border': 'hsla(0, 3%, 94%, 0.45)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
