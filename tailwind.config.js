/** @type {import('tailwindcss').Config} */
export default {
  // So thatTailwind can tree-shake unused styles in production builds.
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

