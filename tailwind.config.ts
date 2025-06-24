import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Apple-inspired custom colors
        midnight: "#0A2540",
        pacific: "#0071E3",
        frost: "#FFFFFF",
        cloud: "#F5F5F7",
        graphite: "#424245",
        shadow: "#1D1D1F",
        sage: "#8DB596",
        coral: "#FF6B6B",
        butter: "#FFD166",
        success: "#4CAF50",
        warning: "#FFC107",
        progress: "#2196F3",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "system-ui", "sans-serif"],
        display: ["SF Pro Display", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        text: ["SF Pro Text", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Responsive typography with clamp
        "responsive-h1": [
          "clamp(1.5rem, 3.5vw, 2.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "responsive-h2": [
          "clamp(1.25rem, 3vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
        "responsive-h3": [
          "clamp(1.125rem, 2.5vw, 1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "responsive-h4": [
          "clamp(1rem, 2vw, 1.25rem)",
          { lineHeight: "1.4", letterSpacing: "-0.005em", fontWeight: "600" },
        ],
        // Fixed sizes
        h1: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.005em", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "400" }],
        caption: ["0.875rem", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "400" }],
        micro: ["0.75rem", { lineHeight: "1.3", letterSpacing: "0.03em", fontWeight: "500" }],
      },
      spacing: {
        // 8px grid system
        "0.5": "2px",
        "1": "4px", // space-1
        "2": "8px", // space-2
        "3": "12px",
        "4": "16px", // space-3
        "5": "20px",
        "6": "24px", // space-4
        "7": "28px",
        "8": "32px", // space-5
        "9": "36px",
        "10": "40px",
        "11": "44px", // Touch target minimum
        "12": "48px", // space-6
        "14": "56px",
        "16": "64px", // space-7
        "20": "80px",
        "24": "96px",
        "28": "112px",
        "32": "128px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200px 0" },
          "100%": { backgroundPosition: "calc(200px + 100%) 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        // Apple-style shadows matching CSS variables
        "apple-sm": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "apple-md": "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "apple-lg": "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
        "apple-xl": "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
        institution: "0px 8px 24px rgba(0, 0, 0, 0.08)",
      },
      screens: {
        // Responsive breakpoints from specification
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1025px",
        xl: "1280px",
        "2xl": "1441px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
