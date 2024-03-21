/** @type {import("prettier").Config} */
const config = {
  // plugins: ['prettier-plugin-tailwindcss'],
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
