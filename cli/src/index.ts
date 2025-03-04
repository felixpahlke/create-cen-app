#!/usr/bin/env node
import { initializeGit } from "./helpers/git.js";
import { installDependencies } from "./helpers/installDependencies.js";
import { getVersion } from "./utils/getCENVersion.js";
import { getNpmVersion, renderVersionWarning } from "./utils/renderVersionWarning.js";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import { type PackageJson } from "type-fest";
import { runCli } from "~/cli/index.js";
import { createProject } from "~/helpers/createProject.js";
import { logNextSteps } from "~/helpers/logNextSteps.js";
import { buildPkgInstallerMap } from "~/installers/index.js";
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
    packages,
    displayName,
    backend,
    pythonVersion,
    flavour,
    template,
    // envVars,
    flags: { noGit, noInstall, noVenv, proxy },
  } = await runCli();

  const usePackages = buildPkgInstallerMap(packages);

  // e.g. dir/@mono/app returns ["@mono/app", "dir/app"]
  const [scopedAppName, appDir] = parseNameAndPath(appName);

  const { projectDir, frontendDir, backendDir, missingDependencies } = await createProject({
    projectName: appDir,
    packages: usePackages,
    backend,
    pythonVersion,
    noInstall,
    noVenv,
    proxy,
    template: template.value,
    flavour,
    // envVars,
    displayName,
  });

  if (flavour !== "backend-only") {
    // Write name to package.json
    const pkgJson = fs.readJSONSync(path.join(frontendDir, "package.json")) as CT3APackageJSON;
    pkgJson.name = scopedAppName;
    pkgJson.ct3aMetadata = { initVersion: getVersion() };
    fs.writeJSONSync(path.join(frontendDir, "package.json"), pkgJson, {
      spaces: 2,
    });
  }

  if (!noInstall && template.value === "create-cen-app") {
    await installDependencies({ frontendDir });
  }

  if (!noGit) {
    await initializeGit(projectDir);
  }

  logNextSteps({
    projectName: appDir,
    packages: usePackages,
    template: template.value,
    noInstall,
    frontendDir,
    backendDir,
    backend,
    noVenv,
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
