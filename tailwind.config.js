/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: { colors: {
      mainGreen: 'rgb(39,103,85)',
      mainBeige: 'rgb(228,224,210)',
      mainGray: 'rgb(68,68,68)',
      mainBlue: 'rgb(83,165,174)',
      darkGreen: 'rgb(17,26,20)',
      mainRed: 'rgb(213, 42, 37)',


  },
  fontFamily: {
    libreBodoni: ['Libre Bodoni', 'serif'],
    opensans: ['Open-sans', 'sans-serif'],
    bitter: ['Bitter', 'serif'],
  },
  fontSize: {
    'xs': '14px',
    'sm' : '16px',
    'm': '20px',
    'l': '25px',
    'xl': '31.25px',
    'xxl': '39.1px'
  },},
  },
  plugins: [],
}

