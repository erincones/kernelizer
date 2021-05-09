const colors = require(`tailwindcss/colors`);

module.exports = {
  purge: {
    mode: `all`,
    content: [
      `pages/**/*.{js,ts,jsx,tsx}`,
      `components/**/*.{js,ts,jsx,tsx}`,
      `node_modules/@fortawesome/**/*.js`
    ],
    options: {
      keyframes: true
    }
  },
  darkMode: `class`,
  theme: {
    colors,
    extend: {}
  },
  variants: {},
  plugins: [],
  corePlugins: {}
};
