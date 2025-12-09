import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          red: '#ff0000',
          yellow: '#ffcf00',
          green: '#00952d',
          white: '#ffffff',
          black: '#000000',
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
