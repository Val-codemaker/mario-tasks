/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mario: {
          sky: '#5C94FC',
          ground: '#E45C10',
          underground: '#000000',
          pipe: '#00A800',
          pipeHighlight: '#00F800',
          coin: '#F8D870',
          bush: '#00A800',
          mountain: '#F8B800',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'system-ui'],
      },
      animation: {
        'mario-run': 'mario-run 0.6s steps(3) infinite',
        'mushroom-spawn': 'mushroom-spawn 0.5s ease-out forwards',
        'bounce': 'bounce 0.5s infinite',
      },
      keyframes: {
        'mario-run': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(20px)' },
        },
        'mushroom-spawn': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '100%': { transform: 'translateY(-40px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
