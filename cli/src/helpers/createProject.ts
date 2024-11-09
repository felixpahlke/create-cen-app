import { preflightCheck } from "./preflightCheck.js";
import * as p from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import { installPackages } from "~/helpers/installPackages.js";
import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import { fastApiInstaller } from "~/installers/fastApi.js";
import { fullStackInstaller } from "~/installers/full-stack-installer.js";
import { AvailableBackends, AvailableTemplates, type PkgInstallerMap } from "~/installers/index.js";
// import { watsonxInstaller } from "~/installers/watsonx.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";

interface CreateProjectOptions {
  projectName: string;
  displayName?: string;
  packages: PkgInstallerMap;
  backend: AvailableBackends;
  pythonVersion: PythonVersion;
  noInstall: boolean;
  noVenv: boolean;
  // envVars?: Record<AvailableEnvVars, string>;
  proxy: boolean;
  template: AvailableTemplates;
  // importAlias: string;
}

type CreateProjectResult = {
  frontendDir: string;
  backendDir: string;
  projectDir: string;
  missingDependencies: string[];
};

export const createProject = async ({
  projectName,
  displayName,
  packages,
  backend,
  pythonVersion,
  noInstall,
  noVenv,
  // envVars,
  proxy,
  template,
}: CreateProjectOptions): Promise<CreateProjectResult> => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  let frontendDir = "";
  let backendDir = "";
  if (template === "create-cen-app" && (backend === "default" || backend === "trpc")) {
    frontendDir = projectDir;
  } else {
    frontendDir = path.resolve(projectDir, `frontend`);
    backendDir = path.resolve(projectDir, `backend`);
  }

  if (!noInstall) {
    p.log.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`);
  }

  const { noInstall: shouldSetNoInstall, missingDependencies } = await preflightCheck({
    projectDir,
    projectName,
    template,
    noInstall,
  });

  noInstall = shouldSetNoInstall;

  if (template === "create-cen-app") {
    // Bootstraps the base next.js application
    await scaffoldProject({
      projectDir,
      projectName,
      frontendDir,
      backendDir,
      pkgManager,
      noInstall,
      proxy,
      packages,
      backend,
      template,
    });

    // Install the selected packages for create-cen-app
    installPackages({
      frontendDir,
      pkgManager,
      packages,
      noInstall,
    });

    // install backend
    if (backend === "fastapi") {
      await fastApiInstaller({ backendDir, noVenv, pythonVersion });
    }

    // update displayName in files
    if (displayName) {
      replaceTextInFiles(frontendDir, "[project-name]", displayName);
    }
  }

  if (template === "full-stack-cen-template") {
    await fullStackInstaller({ backendDir, frontendDir, projectDir, projectName, noInstall });
  }

  return { frontendDir, backendDir, projectDir, missingDependencies };
};
