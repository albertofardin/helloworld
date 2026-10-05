import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        "muted-bg": "var(--muted-bg)",
        "muted-fg": "var(--muted-fg)",
        card: "var(--card)",
        info: "var(--info)",
        warn: "var(--warn)",
        succ: "var(--succ)",
        fail: "var(--fail)",
        border: "var(--border)",
        input: "var(--input)",
        button: "var(--button)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      keyframes: {
        "glass-shine": {
          "0%, 50%": { transform: "translateX(-200%) skewX(-20deg)" },
          "100%": { transform: "translateX(600%) skewX(-20deg)" },
        },
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
      },
      animation: {
        "glass-shine": "glass-shine 4s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
