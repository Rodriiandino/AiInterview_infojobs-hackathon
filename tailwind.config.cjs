/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        success: '#00A550',
        error: '#E93E40',
        primary: '#167DB7',
        GrayL3: '#F5F5F5',
        secondary: '#FF6340',
        alert: '#F1C40F'
      }
    }
  },
  plugins: []
}
