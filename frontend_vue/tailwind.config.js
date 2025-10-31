/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,ts,js,tsx,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#6B7280',
        success: '#10B981',
        error: '#EF4444',
        background: '#F3E8FF',
        surface: '#FFFFFF',
        text: '#374151',
      },
      boxShadow: {
        soft: '0 10px 25px -10px rgba(139,92,246,0.3)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
