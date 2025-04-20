module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'star-size': '60px',
      },
      colors: {
        'star-color': '#fff',
        'star-background': '#fc0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};

