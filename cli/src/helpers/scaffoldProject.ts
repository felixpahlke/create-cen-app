import * as p from "@clack/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import {
  AvailableTemplates,
  PkgInstallerMap,
  type AvailableBackends,
  type InstallerOptions,
} from "~/installers/index.js";
import { proxyInstaller } from "~/installers/proxy.js";
import { buildUsedDependencies } from "~/templateProcessor/buildUsedDependencies.js";
import { processFiles } from "~/templateProcessor/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

type ScaffoldProjectProps = InstallerOptions & {
  packages: PkgInstallerMap;
  projectDir: string;
  backendDir: string;
  proxy: boolean;
  backend: AvailableBackends;
  template: AvailableTemplates;
};

// This bootstraps the base application
export const scaffoldProject = async ({
  template,
  projectName,
  projectDir,
  frontendDir,
  backendDir,
  pkgManager,
  noInstall,
  packages,
  proxy,
  backend,
}: ScaffoldProjectProps) => {
  const srcDir = path.join(PKG_ROOT, "template/base");

  const s = p.spinner();
  s.start(`Scaffolding in: ${projectDir}...\n`);

  // now copying & processing frontend files
  const usedDependencies = buildUsedDependencies({ packages, backend });
  processFiles({ templateDir: srcDir, resultDir: frontendDir, usedDependencies });

  fs.renameSync(path.join(frontendDir, "_gitignore"), path.join(frontendDir, ".gitignore"));
  // Rename _eslintrc.json to .eslintrc.json - we use _eslintrc.json to avoid conflicts with the monorepos linter
  fs.renameSync(path.join(frontendDir, "_eslintrc.cjs"), path.join(frontendDir, ".eslintrc.cjs"));

  if (proxy) {
    proxyInstaller({ frontendDir });
  }

  // add react-query if using external backend
  if (backend !== "default" && backend !== "trpc") {
    addPackageDependency({
      frontendDir,
      dependencies: ["@tanstack/react-query"],
      devMode: false,
    });
  }

  // specifically copying favicon.ico
  // somehow it broke when using fs.copySync
  const srcStream = fs.createReadStream(path.join(srcDir, "public/favicon.ico"), {
    encoding: "binary",
  });
  const destStream = fs.createWriteStream(path.join(frontendDir, "public/favicon.ico"), {
    encoding: "binary",
  });
  srcStream.pipe(destStream);

  const scaffoldedName = projectName === "." ? "App" : chalk.cyan.bold(projectName);

  s.stop();
  p.log.success(`${scaffoldedName} ${chalk.green("scaffolded successfully!")}\n`);
};
