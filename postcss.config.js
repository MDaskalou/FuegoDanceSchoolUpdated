// postcss.config.js
// Obs: Vi använder nu CommonJS-syntax (module.exports)

module.exports = {
  plugins: {
    // VIKTIGT: Lägg till postcss-nesting FÖRE Tailwind
    'postcss-nesting': {}, // Lösning för Swiper CSS
    'tailwindcss': {},
    'autoprefixer': {},
  },
};