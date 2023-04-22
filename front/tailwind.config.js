/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'alert-warning',
    'alert-success',
    'alert-info',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
}

