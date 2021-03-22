module.exports = {
  purge: {
    mode: `all`,
    content: [
      `pages/**/*.{js,ts,jsx,tsx}`,
      `components/**/*.{js,ts,jsx,tsx}`
    ]
  },
  darkMode: `class`,
  theme: {
    extend: {}
  },
  variants: {},
  plugins: [],
  corePlugins: {}
};
