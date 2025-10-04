/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "vc-primary": "#1a1a1a",
        "vc-secondary": "#4a4a4a",
        "vc-muted": "#8a8a8a",
        "vc-light": "#e5e5e5",
        "vc-bg": "#fafafa",
        "vc-bgCard": "#ffffff",
        "vc-border": "#e0e0e0",
        "vc-accent": "#2563eb",
      },
      borderRadius: {
        "vc-card": "12px",
        "vc-button": "8px",
      },
      boxShadow: {
        "vc-card": "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        "vc-card-hover": "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
