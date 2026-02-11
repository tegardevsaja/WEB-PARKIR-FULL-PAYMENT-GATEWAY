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
        primary: {
          50: '#e6fff9',
          100: '#ccfff3',
          200: '#99ffe7',
          300: '#66ffdb',
          400: '#33ffcf',
          500: '#00FFD4',
          600: '#00ccaa',
          700: '#009980',
          800: '#006655',
          900: '#00332b',
        },
        secondary: {
          50: '#eef0ff',
          100: '#dde1ff',
          200: '#bbc3ff',
          300: '#99a5ff',
          400: '#7787ff',
          500: '#5465FF',
          600: '#4351cc',
          700: '#323d99',
          800: '#222866',
          900: '#111433',
        },
        accent: {
          50: '#f8f9ff',
          100: '#f1f3ff',
          200: '#e9ecff',
          300: '#e1e5ff',
          400: '#d9deff',
          500: '#D2DDFF',
          600: '#a8b1cc',
          700: '#7e8599',
          800: '#545866',
          900: '#2a2c33',
        },
        dark: {
          50: '#e6e6e7',
          100: '#ccccce',
          200: '#99999d',
          300: '#66666c',
          400: '#33333b',
          500: '#050208',
          600: '#040206',
          700: '#030105',
          800: '#020103',
          900: '#010102',
        },
      },
    },
  },
  plugins: [],
};
export default config;
