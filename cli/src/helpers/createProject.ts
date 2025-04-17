import { preflightCheck } from "./preflightCheck.js";
import * as p from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import { fullStackInstaller } from "~/installers/full-stack-installer.js";
import { AvailableFlavours } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";

interface CreateProjectOptions {
  projectName: string;
  noInstall: boolean;
  flavour: AvailableFlavours;
}

type CreateProjectResult = {
  frontendDir: string;
  backendDir: string;
  projectDir: string;
  missingDependencies: string[];
};

export const createProject = async ({
  projectName,
  noInstall,
  flavour,
}: CreateProjectOptions): Promise<CreateProjectResult> => {
  const pkgManager = getUserPkgManager();
  const projectDir = path.resolve(process.cwd(), projectName);

  const frontendDir = path.resolve(projectDir, `frontend`);
  const backendDir = path.resolve(projectDir, `backend`);

  if (!noInstall) {
    p.log.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`);
  }

  const { noInstall: shouldSetNoInstall, missingDependencies } = await preflightCheck({
    projectDir,
    projectName,
    noInstall,
    flavour,
  });

  noInstall = shouldSetNoInstall;

  await fullStackInstaller({
    backendDir,
    frontendDir,
    projectDir,
    projectName,
    noInstall,
    flavour,
  });

  return { frontendDir, backendDir, projectDir, missingDependencies };
};
