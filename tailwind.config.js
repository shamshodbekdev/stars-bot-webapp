/** @type {import('tailwindcss').Config} */

// Helper: maps a CSS variable holding "R G B" channels to a Tailwind color
// that supports opacity modifiers (e.g. bg-fg/10).
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral design tokens (see src/index.css for light/dark values)
        bg: token('bg'), // page background
        surface: token('surface'), // cards, inputs
        fg: token('fg'), // primary text / inverted surfaces
        muted: token('muted'), // secondary text
        line: token('line'), // borders & dividers
        inverse: token('inverse'), // text on top of `fg` surfaces
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
