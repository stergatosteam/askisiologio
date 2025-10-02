/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#111111",
          yellow: "#FFD60A",
          white: "#FFFFFF",
          gray: { light: "#E5E7EB", DEFAULT: "#9CA3AF", dark: "#6B7280" },
          success: "#22C55E"
        }
      },
      borderRadius: { xl: "14px" }
    }
  },
  plugins: []
}
