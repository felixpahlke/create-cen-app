/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  printWidth: 100,
  tabWidth: 2,
  trailingComma: "all",
};

module.exports = config;
