import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        primary: '#ff6b8a',
        accent: '#f5c842'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        jp: ['var(--font-noto-jp)', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        flicker: 'flicker 1.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
};

export default config;
