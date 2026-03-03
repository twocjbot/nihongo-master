import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#1A1714',
        primary: '#C8391A',
        accent: '#C8391A',
        border: '#D4CFC7',
        paper: '#F5F0E8',
        ink: '#1A1714'
      },
      fontFamily: {
        shippori: ['Shippori Mincho', 'serif'],
        mono: ['DM Mono', 'monospace'],
        jp: ['Noto Sans JP', 'sans-serif'],
        sans: ['DM Mono', 'monospace']
      }
    }
  },
  plugins: []
};

export default config;
