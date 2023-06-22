import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    API_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   * keep in mind that NEXT_PUBLIC_ env vars HAVE TO BE AVAILABLE AT BUILD TIME, so if you want to
   * make them dynamic, you have to use serverside env vars and pass them to the client via
   * getServerSideProps
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    API_URL: process.env.API_URL,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` set to false, if you want to throw errors at build time 
   * on invalid/missing environment variables. or make it dynamic with:
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
   */
  skipValidation: true,
});
