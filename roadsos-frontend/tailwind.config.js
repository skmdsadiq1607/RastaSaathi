module.exports = {
  content: ['./index.html', './public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { emergency: '#DC2626', alert: '#EA580C', warning: '#D97706', safe: '#16A34A', dark: '#0F172A', surface: '#1E293B', border: '#334155' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['ui-monospace', 'SFMono-Regular', 'monospace'] }
    }
  },
  plugins: []
};
