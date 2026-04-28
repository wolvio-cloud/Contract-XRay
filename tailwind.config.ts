/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // D-EDGE brand — direct hex tokens
        navy: {
          DEFAULT: "#0A2342",
          50: "#E8EDF4",
          100: "#C5D0E0",
          500: "#3A5F8F",
          900: "#0A2342",
        },
        orange: {
          DEFAULT: "#F26B38",
          50: "#FDF0EA",
          100: "#FAD9C9",
          600: "#D95520",
        },
        // Semantic tokens backed by CSS custom properties (set in globals.css)
        background: "var(--background)",
        surface: "var(--surface)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        border: "var(--border)",
        // Severity scale
        severity: {
          high: "#DC2626",
          medium: "#F59E0B",
          low: "#10B981",
        },
      },
      fontFamily: {
        // next/font injects --font-sans and --font-mono on <html>
        sans: ["var(--font-sans)", "Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
