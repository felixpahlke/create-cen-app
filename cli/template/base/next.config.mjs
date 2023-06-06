/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
const envModule = await import("./src/env.mjs");
const env = envModule.env;

/** @type {import("next").NextConfig} */
const config = {
  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  output: "standalone", // to enable running in docker
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${env.API_BASE_URL}/api/:path*`,
      },
    ];
  },
};
export default config;
