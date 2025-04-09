import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "compass-blue": {
          DEFAULT: "hsl(var(--compass-blue))",
          foreground: "hsl(var(--compass-blue-foreground))",
        },
        "document": {
          DEFAULT: "hsl(var(--document-bg))",
          toolbar: "hsl(var(--document-toolbar-bg))",
          border: "hsl(var(--document-border))",
          code: "hsl(var(--document-code-bg))",
          "table-header": "hsl(var(--document-table-header-bg))",
        },
      },
    },
  },
  plugins: [],
};
export default config;