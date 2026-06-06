/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e5ab8",
        primaryLight: "#387bd5",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#d93838",
      },
    },
  },
  plugins: [],
}
