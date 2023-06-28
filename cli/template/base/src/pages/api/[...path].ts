/**
 * This will match all requests going to /api and proxy them to the API_URL specified in the .env file.
 * This is useful for local development when you want to use a separate backend.
 *
 * Delete this file if you want to use your own Next.js API routes.
 */

import httpProxy from "http-proxy";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

const proxy = httpProxy.createProxyServer();
// Make sure that we don't parse JSON bodies on this route:
export const config = {
  api: {
    bodyParser: false,
  },
};

const proxyHandler = (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.url) {
    req.url = req.url.replace(/^\/api/, "");
  }
  return new Promise((resolve, reject) => {
    proxy.web(req, res, { target: env.API_URL, changeOrigin: true }, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export default proxyHandler;
