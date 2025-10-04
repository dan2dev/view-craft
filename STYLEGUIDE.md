# View-Craft Design System Style Guide

A retro-futuristic design system inspired by the View-Craft cyclops robot mascot. This guide documents the design tokens, components, and best practices for maintaining the soft 3D, Raygun-Gothic aesthetic.

---

## 🎨 Design Philosophy

**Personality**: Friendly, curious, approachable — think of a helpful robot companion from the golden age of sci-fi.

**Visual Language**:
- Rounded, pill-shaped elements with generous border radii
- Soft 3D feel via gradients, inner highlights, and subtle shadows
- Warm, inviting color palette with teal metallics and sandy backdrops
- Micro-interactions that feel smooth and responsive

---

## 🧱 Design Tokens

### Color Palette

#### Brand Colors (Light Theme)
```css
--vc-color-primary: #5BA5A0       /* Teal Metal */
--vc-color-primary-strong: #4A8E89 /* Darker Teal (hover/active) */
--vc-color-primary-weak: #CFE7E5   /* Light Teal (surfaces) */
```

#### Accents
```css
--vc-accent-1: #9FD3CD  /* Sea Mint */
--vc-accent-2: #BCE5E1  /* Antenna Highlight */
```

#### Backgrounds
```css
--vc-bg: #F3D9B6        /* Warm Sand */
--vc-bg-soft: #F7E6CD   /* Peach Mist */
--vc-panel: #FAF7F0     /* Ivory Panel */
```

#### Elevations
```css
--vc-elev-1: #F9F5EC    /* Subtle elevation */
--vc-elev-2: #F1E8DA    /* Medium elevation */
--vc-elev-3: #E7DAC7    /* Strong elevation */
```

#### Text/Ink
```css
--vc-ink: #1F2A2E        /* Graphite - primary text */
--vc-ink-soft: #425157   /* Slate - secondary text */
--vc-ink-muted: #6B7E86  /* Blue-Gray - tertiary text */
--vc-line: #DADFE2       /* Dividers/borders */
```

### Shape & Radius
```css
--vc-radius-lg: 24px   /* Large cards, containers */
--vc-radius-md: 16px   /* Buttons, inputs */
--vc-radius-sm: 10px   /* Small badges, code blocks */
```

### Shadows & 3D Effects
```css
--vc-shadow-1: 0 8px 20px rgba(31, 42, 46, 0.10)    /* Base shadow */
--vc-shadow-2: 0 14px 38px rgba(31, 42, 46, 0.14)   /* Hover/elevated */
--vc-inner-hi: inset 0 1px 0 rgba(255, 255, 255, 0.55)  /* Top highlight */
--vc-inner-sh: inset 0 -1px 0 rgba(0, 0, 0, 0.10)       /* Bottom shade */
--vc-focus: 0 0 0 3px color-mix(in oklab, var(--vc-color-primary) 35%, white)
```

### Gradients
```css
--vc-grad-brand: linear-gradient(180deg, #6DB0AB 0%, #5BA5A0 60%, #4A8E89 100%)
--vc-grad-panel: linear-gradient(180deg, #FAF7F0 0%, #F3D9B6 100%)
```

---

## 🔤 Typography

### Font Families
- **Display/Headings**: Outfit, Plus Jakarta Sans, Sora, Inter, sans-serif
- **Body/UI**: Inter, Nunito Sans, system-ui, sans-serif
- **Monospace**: JetBrains Mono, Fira Code, Menlo, monospace

### Sizing & Hierarchy
```css
h1: clamp(2rem, 1.2rem + 2.5vw, 3.2rem)    /* ~32-50px */
h2: clamp(1.6rem, 1.1rem + 1.6vw, 2.4rem)  /* ~26-38px */
body: 1rem - 1.0625rem                      /* 16-17px */
```

### Font Properties
- **Letter Spacing**: -0.01em for headings (tighter, modern look)
- **Line Height**: 1.1 for h1, 1.2 for h2, 1.6 for body
- **Font Weight**: 600 for headings, 400-500 for body

---

## 🧩 Component Patterns

### Buttons

#### Solid Primary (CTA)
```css
background: var(--vc-grad-brand);
color: #0E1517;  /* Near-black for retro contrast */
border-radius: var(--vc-radius-md);
box-shadow: var(--vc-shadow-1), var(--vc-inner-hi), var(--vc-inner-sh);
```
**Hover**: `transform: translateY(-1px)` + `box-shadow: var(--vc-shadow-2)`

#### Soft Button
```css
background: var(--vc-color-primary-weak);
color: var(--vc-ink);
border-radius: var(--vc-radius-md);
box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
```

#### Ghost Button
```css
background: transparent;
color: var(--vc-color-primary-strong);
border: 1px solid color-mix(in oklab, var(--vc-color-primary) 50%, white);
border-radius: var(--vc-radius-md);
```

### Cards
```css
background: var(--vc-grad-panel);
border: 1px solid var(--vc-line);
border-radius: var(--vc-radius-lg);
box-shadow: var(--vc-shadow-1);
padding: 1.25rem;
```
**Hover**: `scale(1.02)` + `box-shadow: var(--vc-shadow-2)`

### Inputs
```css
background: var(--vc-panel);
border: 1px solid var(--vc-line);
border-radius: 14px;
box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
padding: 0.7rem 0.9rem;
color: var(--vc-ink);
```
**Focus**: Add `box-shadow: var(--vc-focus)`

### Badges
```css
background: var(--vc-color-primary-weak);
color: var(--vc-ink);
border: 1px solid var(--vc-accent-1);
border-radius: 999px;  /* Pill shape */
padding: 0.25rem 1rem;
font-size: 0.875rem;
box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
```

### Code Blocks
```css
background: var(--code-bg);
border: 1px solid var(--border-color);
border-radius: var(--vc-radius-md);
box-shadow: var(--vc-inner-hi), var(--vc-inner-sh);
padding: 1rem;
font-family: JetBrains Mono, monospace;
color: var(--code-text);
```

---

## ♿ Accessibility

### Contrast Requirements (WCAG AA)
- **Normal text** (< 18pt): Minimum 4.5:1
- **Large text** (≥ 18pt or bold ≥ 14pt): Minimum 3:1
- **Interactive elements**: Minimum 3:1 against background

### Current Compliance
✅ Primary text (`--vc-ink: #1F2A2E`) on light backgrounds meets AA
✅ Buttons use sufficient contrast (#0E1517 on teal gradient)
✅ Links and interactive states have visible focus rings

### Focus States
All interactive elements include:
```css
:focus-visible {
  outline: none;
  box-shadow: var(--vc-focus);
}
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🌓 Dark Mode

Dark theme uses inverted luminosity with adjusted teal tones:

```css
--vc-bg: #111718
--vc-panel: #0E1517
--vc-ink: #EAEFF1
--vc-color-primary: #74C0BA  /* Brighter teal for dark bg */
--vc-grad-panel: linear-gradient(180deg, #0F1718 0%, #151D1F 100%)
```

Toggle via `data-theme="dark"` on `:root` or `<html>`.

---

## ✅ Do's and Don'ts

### ✅ Do
- Use generous border radii (16px+) for a friendly, soft aesthetic
- Combine inner highlights + shadows for depth
- Use `hover:scale-105` or `translateY(-1px)` for interactive feedback
- Maintain warm background tones (sand/peach) in light mode
- Apply retro-futuristic touches: rounded strokes, pill shapes, subtle antenna motifs

### ❌ Don't
- Use sharp, rectangular corners (breaks the soft aesthetic)
- Apply harsh drop shadows without gradual blur
- Use high-contrast neon colors (keep it warm and approachable)
- Ignore accessibility — always test contrast ratios
- Overuse animations (respect `prefers-reduced-motion`)

---

## 🔧 Tailwind Integration

If using Tailwind, merge this config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        vc: {
          primary: "#5BA5A0",
          primaryStrong: "#4A8E89",
          primaryWeak: "#CFE7E5",
          // ... (see tailwind.config.js for full list)
        }
      },
      borderRadius: {
        'vc-lg': '24px',
        'vc-md': '16px',
        'vc-sm': '10px',
      },
      boxShadow: {
        'vc-1': '0 8px 20px rgba(31,42,46,0.10)',
        'vc-2': '0 14px 38px rgba(31,42,46,0.14)',
        'vc-inner-hi': 'inset 0 1px 0 rgba(255,255,255,0.55)',
        'vc-inner-sh': 'inset 0 -1px 0 rgba(0,0,0,0.10)',
      },
      backgroundImage: {
        'vc-brand': 'linear-gradient(180deg,#6DB0AB 0%,#5BA5A0 60%,#4A8E89 100%)',
        'vc-panel': 'linear-gradient(180deg,#FAF7F0 0%,#F3D9B6 100%)',
      },
    },
  },
}
```

**Example Button**:
```html
<button class="rounded-vc-md px-4 py-3 font-semibold text-[#0E1517]
  shadow-vc-1 shadow-vc-inner-hi shadow-vc-inner-sh bg-vc-brand
  hover:shadow-vc-2 transition-all">
  Get Started
</button>
```

---

## 📦 Token JSON (Optional)

For design tools or token pipelines:

```json
{
  "color": {
    "primary": "#5BA5A0",
    "primaryStrong": "#4A8E89",
    "primaryWeak": "#CFE7E5",
    "bg": "#F3D9B6",
    "panel": "#FAF7F0",
    "ink": "#1F2A2E"
  },
  "radius": { "lg": "24px", "md": "16px", "sm": "10px" },
  "shadow": {
    "elev1": "0 8px 20px rgba(31,42,46,0.10)",
    "innerHi": "inset 0 1px 0 rgba(255,255,255,0.55)"
  }
}
```

---

## 🚀 Getting Started

1. **Import CSS tokens** in your global stylesheet (already in `src/style.css`)
2. **Apply design tokens** to components using CSS variables
3. **Use Tailwind utilities** or custom classes with token references
4. **Test contrast** — ensure all text meets WCAG AA (use tools like WebAIM Contrast Checker)
5. **Respect motion preferences** — animations should degrade gracefully

---

## 📚 Resources

- **Contrast Checker**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Accessibility Guidelines**: [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- **Color Mixing**: [MDN color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)

---

**Made with View-Craft** 🤖✨
*Embrace the retro-future. Build with curiosity.*
