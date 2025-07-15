import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hot-herbe-green': '#14b714',
        'hot-herbe-dark': '#111811',
        'hot-herbe-light-green': '#638863',
        'hot-herbe-bg': '#f0f4f0',
        'hot-herbe-border': '#dce5dc',
        'hot-herbe-light-gray': '#bbcebb',
      },
      fontFamily: {
        'lexend': ['Lexend', '"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
export default config