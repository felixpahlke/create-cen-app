import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // this needs to be disabled for Carbon Components to work
  // properly with tailwindcss
  corePlugins: {
    preflight: false,
  },
  plugins: [],
} satisfies Config;
