import { removePackages } from "./removePackages.js";
import path from "path";
import { installPackages } from "~/helpers/installPackages.js";
import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import {
  selectAppFile,
  selectCompontentsFiles,
  selectIndexFile,
} from "~/helpers/selectBoilerplate.js";
import { fastApiInstaller } from "~/installers/fastApi.js";
import { AvailableBackends, type PkgInstallerMap } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";

interface CreateProjectOptions {
  projectName: string;
  packages: PkgInstallerMap;
  backend: AvailableBackends;
  pythonVersion: PythonVersion;
  noInstall: boolean;
  noVenv: boolean;
  importAlias: string;
}

type Directories = {
  frontendDir: string;
  backendDir: string;
  projectDir: string;
};

export const createProject = async ({
  projectName,
  packages,
  backend,
  pythonVersion,
  noInstall,
  noVenv,
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
  });

  // Install the selected packages
  installPackages({
    frontendDir,
    pkgManager,
    packages,
    noInstall,
  });

  // TODO: Look into using handlebars or other templating engine to scaffold without needing to maintain multiple copies of the same file
  selectAppFile({ frontendDir, packages, backend });
  selectIndexFile({ frontendDir, packages, backend });
  selectCompontentsFiles({ frontendDir, packages, backend });

  // remove stuff the user doesn't want
  removePackages({ packages, projectDir, frontendDir });

  // install backend
  if (backend === "fastapi") {
    await fastApiInstaller({ backendDir, noVenv, pythonVersion });
  }

  return { frontendDir, backendDir, projectDir } as Directories;
};
