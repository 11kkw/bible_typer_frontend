import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pastel-blue": "#a7d8f0",
        "pastel-green": "#a8d8c9",
        "text-dark": "#1a202c",
        "text-light": "#4a5568",
        "bg-base": "#f7fafc",
      },
      boxShadow: {
        apple: "0 4px 12px 0 rgba(0,0,0,0.1)",
      },
      transitionDuration: {
        200: "200ms",
      },
    },
  },
  plugins: [],
}

export default config
