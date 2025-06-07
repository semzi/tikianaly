// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ui: {
          success: '#00D68F',
          negative: '#FF3D71',
          pending: '#FFC94D',
        },
        brand: {
          primary: '#0075FF',
          secondary: '#FF4405',
          p1: '#3391FF',
          p2: '#66A9FF',
          p3: '#99C1FF',
          p4: '#CCE0FF',
          s1: '#FF6D3D',
          s2: '#FF9373',
          s3: '#FFBBAA',
          s4: '#FFE0D9',
        },
        neutral: {
          n1: '#1C1C1E',
          n2: '#2C2C2E',
          n3: '#3A3A3C',
          n4: '#48484A',
          n5: '#636366',
          m6: '#AEAEB2',
          white: '#FFFFFF',
          smoke100: '#F5F5F7',
          smoke200: '#E5E5EA',
          smoke300: '#D1D1D6',
          snow100: '#F2F2F7',
          snow200: '#E0E0E0',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
