import path from "path";
import { installPackages } from "~/helpers/installPackages.js";
import { scaffoldProject } from "~/helpers/scaffoldProject.js";
import { selectAppFile, selectIndexFile } from "~/helpers/selectBoilerplate.js";
import { fastApiInstaller } from "~/installers/fastApi.js";
import { AvailableBackends, type PkgInstallerMap } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";

interface CreateProjectOptions {
  projectName: string;
  packages: PkgInstallerMap;
  backend: AvailableBackends;
  noInstall: boolean;
  importAlias: string;
}

export const createProject = async ({
  projectName,
  packages,
  backend,
  noInstall,
}: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  // Bootstraps the base Next.js application
  await scaffoldProject({
    projectName,
    projectDir,
    pkgManager,
    noInstall,
  });

  // Install the selected packages
  installPackages({
    projectDir,
    pkgManager,
    packages,
    noInstall,
  });

  // TODO: Look into using handlebars or other templating engine to scaffold without needing to maintain multiple copies of the same file
  selectAppFile({ projectDir, packages });
  selectIndexFile({ projectDir, packages });

  // remove tailwind css import if not using tailwind
  if (!packages.tailwind.inUse) {
    replaceTextInFiles(projectDir, 'import "~/styles/tailwind.css";', "");
  }

  // install backend
  if (backend === "fastapi") {
    await fastApiInstaller();
  }

  return projectDir;
};
