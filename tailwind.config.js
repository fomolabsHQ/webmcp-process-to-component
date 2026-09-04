/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--color-paper)",
          alt: "var(--color-paper-alt)",
          sunken: "var(--color-paper-sunken)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          2: "var(--color-ink-2)",
          muted: "var(--color-ink-muted)",
          subtle: "var(--color-ink-subtle)",
        },
        rule: {
          DEFAULT: "var(--color-rule)",
          strong: "var(--color-rule-strong)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
          glow: "var(--color-accent-glow)",
          deep: "var(--color-accent-deep)",
        },
        focus: "var(--color-focus)",
      },
      fontFamily: {
        display: ["Figtree", "system-ui", "-apple-system", "sans-serif"],
        body: ["DM Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["DM Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
        input: "var(--radius-input)",
      },
      boxShadow: {
        glow: "0 0 35px var(--color-accent-glow)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
