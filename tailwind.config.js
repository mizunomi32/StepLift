/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ダークモード
        dark: {
          background: '#0A0A0A',
          card: '#1C1C1E',
          primary: '#22C55E',
          secondary: '#3B82F6',
          accent: '#F59E0B',
          text: '#FFFFFF',
          subtext: '#9CA3AF',
        },
        // ライトモード
        light: {
          background: '#FFFFFF',
          card: '#F2F2F7',
          primary: '#16A34A',
          secondary: '#2563EB',
          accent: '#D97706',
          text: '#000000',
          subtext: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};
