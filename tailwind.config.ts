import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f5',
          600: '#287a5b',
          800: '#18513c',
          950: '#0b2d22',
        },
      },
    },
  },
  plugins: [],
}

export default config
