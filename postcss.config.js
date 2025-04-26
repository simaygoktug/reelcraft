// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/nesting": {},
    "@tailwindcss/postcss": {},    // ← bu satır eskiden `tailwindcss: {}` idi
    autoprefixer: {},
  },
};
