/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      light: {

        "primary": "#005c9f",

        "secondary": "#ffe721",

        "accent": "#ffe721",

        "neutral": "#181A2A",

        "base-100": "#FFFFFF",

        "info": "#005c9f",

        "success": "#36D399",

        "warning": "#FBBD23",

        "error": "#F87272",
      },
      night: {

        "primary": "#005c9f",

        "secondary": "#ffe721",

        "accent": "#ffe721",

        "neutral": "#f3f4f6",

        "base-100": "#151616",

        "info": "#005c9f",

        "success": "#36D399",

        "warning": "#FBBD23",

        "error": "#F87272",
      },
    },],
  },
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    }
  }
}