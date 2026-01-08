/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': 'var(--dark-bg)',
        'dimmer-dark-bg': 'var(--dimmer-dark-bg)',
        'card-bg': 'var(--card-bg)',
        'card-bg-lighter': 'var(--card-bg-lighter)',
        'primary-button': 'var(--primary-button)',
        'primary-button-hover': 'var(--primary-button-hover)',
        'primary-button-active': 'var(--primary-button-active)',
        'secondary-button': 'var(--secondary-button)',
        'secondary-button-hover': 'var(--secondary-button-hover)',
        'meta-tag-color': 'var(--meta-tag-color)',
        'main-border': 'var(--main-border-color)',
        'primary-text-color': 'var(--primary-text-color)',
        'secondary-text-color': 'var(--secondary-text-color)',
        'mid-dim-font-color': 'var(--mid-dim-font-color)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
