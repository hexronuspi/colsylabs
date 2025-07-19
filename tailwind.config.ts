import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D0D10',    // A deep, almost-black for text
        'brand-blue': '#3B82F6',   // Vibrant, electric blue for the aurora
        'brand-white': '#F9FAFB',  // A soft, clean off-white
      },
      boxShadow: {
        'aurora-blue': '0px 0px 30px 10px rgba(59, 130, 246, 0.4)',
        'aurora-white': '0px 0px 25px 8px rgba(249, 250, 251, 0.7)',
      },
      animation: {
        'text-reveal': 'text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s forwards',
      },
    },
          keyframes: {
        'text-reveal': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'vibrate-fast': 'vibrate 0.2s linear infinite',
      }
  },
  plugins: [],
};
export default config;
