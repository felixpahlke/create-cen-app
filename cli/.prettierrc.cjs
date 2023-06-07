/** @type {import('prettier').Config} */
const config = {
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
  tabWidth: 2,
  trailingComma: "all",
  tailwindConfig: "./template/extras/config/tailwind.config.ts",
  printWidth: 100,
};

module.exports = config;
