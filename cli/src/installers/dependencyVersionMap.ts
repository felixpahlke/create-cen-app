/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // NextAuth.js
  "next-auth": "^4.22.1",
  "@next-auth/prisma-adapter": "^1.0.5",

  // Prisma
  prisma: "^4.14.0",
  "@prisma/client": "^4.14.0",

  // TailwindCSS
  tailwindcss: "^3.4.1",
  autoprefixer: "^10.4.14",
  postcss: "^8.4.21",
  prettier: "^3.1.0",
  "prettier-plugin-tailwindcss": "^0.5.7",

  // tRPC
  "@trpc/client": "^10.45.0",
  "@trpc/server": "^10.45.0",
  "@trpc/react-query": "^10.45.0",
  "@trpc/next": "^10.45.0",
  // & external Backend
  "@tanstack/react-query": "^4.29.7",
  superjson: "1.12.2",

  // recoil
  recoil: "^0.7.7",
  //carbon
  "@carbon/icons-react": "^11.34.1",
  "@carbon/react": "^1.48.1",
  // proxy
  "http-proxy": "^1.18.1",
  "@types/http-proxy": "^1.17.11",
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
