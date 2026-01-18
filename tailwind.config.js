
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-taupe": "#8D8176",
        "natural-bg": "#F5F5F0",
        "natural-card": "#FFFFFF",
        "accent-sand": "#D6CFC7",
        "brand-beige": "#F7F3F0",
        "brand-tea": "#A8B19E",
        "brand-green": "#8BAA91",
        "text-main": "#4A4A4A",
        "text-light": "#8E8E93"
      },
      fontFamily: {
        "display": ["Quicksand", "Noto Sans SC", "sans-serif"],
        "sans": ["Inter", "Noto Sans SC", "sans-serif"]
      },
      borderRadius: {
        "sm": "12px",
        "DEFAULT": "18px",
        "lg": "24px",
        "xl": "32px",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "full": "9999px"
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card': '0 12px 40px -10px rgba(141, 129, 118, 0.12)',
      }
    },
  },
  plugins: [],
}
