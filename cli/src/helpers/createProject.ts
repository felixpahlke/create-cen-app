import path from "path";
import { installPackages } from "~/helpers/installPackages.js";
import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import { fastApiInstaller } from "~/installers/fastApi.js";
import { AvailableBackends, AvailableEnvVars, type PkgInstallerMap } from "~/installers/index.js";
import { watsonxInstaller } from "~/installers/watsonx.js";
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
  envVars?: Record<AvailableEnvVars, string>;
  proxy: boolean;
  // importAlias: string;
}

type Directories = {
  frontendDir: string;
  backendDir: string;
  projectDir: string;
};

export const createProject = async ({
  projectName,
  displayName,
  packages,
  backend,
  pythonVersion,
  noInstall,
  noVenv,
  envVars,
  proxy,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  let frontendDir = "";
  let backendDir = "";
  if (backend === "default" || backend === "trpc") {
    frontendDir = projectDir;
  } else {
    frontendDir = path.resolve(projectDir, `frontend`);
    backendDir = path.resolve(projectDir, `backend`);
  }

  // Bootstraps the base Next.js application
  await scaffoldProject({
    projectName,
    frontendDir,
    projectDir,
    pkgManager,
    noInstall,
    proxy,
    packages,
    backend,
  });

  // Install the selected packages
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
  if (backend === "watsonx") {
    await watsonxInstaller({ backendDir, frontendDir, noVenv, pythonVersion, envVars });
  }

  // update displayName in files
  if (displayName) {
    replaceTextInFiles(frontendDir, "[project-name]", displayName);
  }

  return { frontendDir, backendDir, projectDir } as Directories;
};
