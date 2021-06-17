const colors = require(`tailwindcss/colors`);

module.exports = {
  purge: {
    mode: `all`,
    content: [
      `node_modules/@fortawesome/**/*.js`,
      `pages/**/*.{js,ts,jsx,tsx}`,
      `components/**/*.{js,ts,jsx,tsx}`
    ],
    options: {
      keyframes: true
    }
  },
  darkMode: `class`,
  theme: {
    colors,
    extend: {
      cursor: {
        grab: `grab`,
        grabbing: `grabbing`
      }
    }
  },
  variants: {},
  plugins: [],
  corePlugins: {}
};
