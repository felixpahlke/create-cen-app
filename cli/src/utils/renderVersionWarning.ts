import { getVersion } from "./getCENVersion.js";
import * as p from "@clack/prompts";
import { execSync } from "child_process";
import https from "https";

export const renderVersionWarning = (npmVersion: string) => {
  const currentVersion = getVersion();

  //   console.log("current", currentVersion);
  //   console.log("npm", npmVersion);

  if (currentVersion.includes("beta")) {
    p.log.warn("  You are using a beta version of create-cen-app.");
    p.log.warn("  Please report any bugs you encounter.");
  } else if (currentVersion.includes("next")) {
    p.log.warn(
      "  You are running create-cen-app with the @next tag which is no longer maintained.",
    );
    p.log.warn("  Please run the CLI with @latest instead.");
  } else if (currentVersion !== npmVersion) {
    p.log.warn("  You are using an outdated version of create-cen-app.");
    p.log.warn(
      `  Your version: ${currentVersion}. Latest version in the npm registry: ${npmVersion}`,
    );
    p.log.warn("  Please run the CLI with @latest to get the latest updates.");
  }
  console.log("");
};

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
type DistTagsBody = {
  latest: string;
};

function checkForLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get("https://registry.npmjs.org/-/package/create-cen-app/dist-tags", (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve((JSON.parse(body) as DistTagsBody).latest);
          });
        } else {
          reject();
        }
      })
      .on("error", () => {
        // p.log.error("Unable to check for latest version.");
        reject();
      });
  });
}

export const getNpmVersion = () =>
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync("npm view create-cen-app version").toString().trim();
    } catch {
      return null;
    }
  });
