/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        vc: {
          primary: "#5BA5A0",
          primaryStrong: "#3D7973",
          primaryWeak: "#D4F1ED",
          accentMint: "#A8E6DD",
          accentSeafoam: "#8FD9CE",
          accentTeal: "#6BC5BA",
          accentPeach: "#FFB996",
          accentCoral: "#FF9F7A",
          accentSky: "#89D4E8",
          bg: "#FFF5E8",
          bgSoft: "#FFEAD4",
          bgAccent: "#E8F9F6",
          panel: "#FFFBF5",
          elev1: "#F0FAF8",
          elev2: "#E3F5F2",
          elev3: "#D4EDE8",
          ink: "#1F2A2E",
          inkSoft: "#3D5157",
          inkMuted: "#6B7E86",
          line: "#D4E8E4",
        },
      },
      borderRadius: {
        "vc-xl": "32px",
        "vc-lg": "28px",
        "vc-md": "20px",
        "vc-sm": "14px",
        "vc-xs": "10px",
      },
      boxShadow: {
        "vc-1": "0 8px 20px rgba(91,165,160,0.12)",
        "vc-2": "0 14px 38px rgba(91,165,160,0.18)",
        "vc-glow": "0 0 32px rgba(168,230,221,0.3)",
        "vc-inner-hi": "inset 0 2px 0 rgba(255,255,255,0.6)",
        "vc-inner-sh": "inset 0 -2px 0 rgba(91,165,160,0.08)",
      },
      backgroundImage: {
        "vc-brand": "linear-gradient(135deg,#A8E6DD 0%,#6BC5BA 50%,#5BA5A0 100%)",
        "vc-panel": "linear-gradient(160deg,#FFFBF5 0%,#FFE8D0 100%)",
        "vc-accent": "linear-gradient(135deg,#89D4E8 0%,#8FD9CE 100%)",
        "vc-warm": "linear-gradient(135deg,#FFB996 0%,#FF9F7A 100%)",
      },
      fontFamily: {
        display: ["Outfit", "Plus Jakarta Sans", "Sora", "Inter", "sans-serif"],
        body: ["Inter", "Nunito Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
