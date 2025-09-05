import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        neon: "#00FFEA",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            boxShadow: "0 0 0px rgba(255,43,214,0.7)", // GameXBuddy neon magenta
          },
          "50%": {
            opacity: "0.9",
            transform: "scale(1.03)",
            boxShadow: "0 0 25px rgba(255,43,214,0.9)",
          },
        },
        "synthwave-pulse": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "neon-flicker": {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": {
            textShadow: "0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #00f5ff, 0 0 80px #00f5ff, 0 0 90px #00f5ff, 0 0 100px #00f5ff, 0 0 150px #00f5ff",
            filter: "brightness(1)",
            opacity: "1",
          },
          "20%, 24%, 55%": {
            textShadow: "none",
            filter: "brightness(1.5)",
            opacity: "0.8",
          },
        },
        "button-neon-bounce": {
          "0%, 20%, 53%, 80%, 100%": {
            animationTimingFunction: "cubic-bezier(0.215,0.610,0.355,1.000)",
            transform: "translate3d(0,0,0)",
          },
          "40%, 43%": {
            animationTimingFunction: "cubic-bezier(0.755,0.050,0.855,0.060)",
            transform: "translate3d(0,-30px,0)",
          },
          "70%": {
            animationTimingFunction: "cubic-bezier(0.755,0.050,0.855,0.060)",
            transform: "translate3d(0,-15px,0)",
          },
          "90%": {
            transform: "translate3d(0,-4px,0)",
          },
        },
        "cyber-shake": {
          "0%": { transform: "translate(0)" },
          "25%": { transform: "translate(-5px, -5px)" },
          "50%": { transform: "translate(5px, 5px)" },
          "75%": { transform: "translate(-5px, 5px)" },
          "100%": { transform: "translate(0)" },
        },
        "gradient-shift": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "logo-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255,43,214,0.5)",
            filter: "brightness(1) saturate(1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(255,43,214,0.8), 0 0 60px rgba(139,92,246,0.4)",
            filter: "brightness(1.2) saturate(1.3)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "synthwave-pulse": "synthwave-pulse 10s ease infinite",
        "neon-flicker": "neon-flicker 1.5s infinite alternate",
        "button-bounce": "button-neon-bounce 1s infinite",
        "cyber-shake": "cyber-shake 0.5s ease-in-out",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "logo-glow": "logo-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
