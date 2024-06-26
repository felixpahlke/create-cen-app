import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // Uncomment this if you have problems with tailwindcss and carbon
  // corePlugins: {
  //   preflight: false,
  // },
  plugins: [],
} satisfies Config;
