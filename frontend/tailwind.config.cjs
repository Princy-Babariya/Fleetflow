module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#0B63FF',
        accentGreen: '#16A34A',
        alertRed: '#EF4444',
        maintenanceOrange: '#F59E0B',
        neutralGray: '#F3F4F6'
      },
      boxShadow: {
        soft: '0 6px 18px rgba(15,23,42,0.06)'
      },
      borderRadius: {
        xl: '12px'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
