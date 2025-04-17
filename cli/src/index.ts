#!/usr/bin/env node
import { initializeGit } from "./helpers/git.js";
import { getVersion } from "./utils/getCENVersion.js";
import { getNpmVersion, renderVersionWarning } from "./utils/renderVersionWarning.js";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { type PackageJson } from "type-fest";
import { runCli } from "~/cli/index.js";
import { createProject } from "~/helpers/createProject.js";
import { logNextSteps } from "~/helpers/logNextSteps.js";
import { parseNameAndPath } from "~/utils/parseNameAndPath.js";
import { renderTitle } from "~/utils/renderTitle.js";

type CT3APackageJSON = PackageJson & {
  ct3aMetadata?: {
    initVersion: string;
  };
};

const main = async () => {
  const npmVersion = await getNpmVersion();
  renderTitle();
  npmVersion && renderVersionWarning(npmVersion);

  const {
    appName,
    flavour,
    flags: { noGit, noInstall },
  } = await runCli();

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName);

  const { projectDir, frontendDir, missingDependencies } = await createProject({
    projectName: appDir,
    noInstall,
    flavour,
  });

  if (flavour !== "backend-only" && flavour !== "backend-only-no-db") {
    // Write name to package.json
    const pkgJson = fs.readJSONSync(path.join(frontendDir, "package.json")) as CT3APackageJSON;
    pkgJson.name = scopedAppName;
    pkgJson.ct3aMetadata = { initVersion: getVersion() };
    fs.writeJSONSync(path.join(frontendDir, "package.json"), pkgJson, {
      spaces: 2,
    });
  }

  if (!noGit) {
    await initializeGit(projectDir);
  }

  logNextSteps({
    projectName: appDir,
    noInstall,
    missingDependencies,
    flavour,
  });

  process.exit(0);
};

main().catch((err) => {
  p.log.error("Aborting installation...");
  if (err instanceof Error) {
    p.log.error(err.message);
  } else {
    p.log.error("An unknown error has occurred. Please open an issue on github with the below:");
    console.log(err);
  }
  process.exit(1);
});
