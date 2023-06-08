import chalk from "chalk";
import { log } from "console";
import { DEFAULT_APP_NAME } from "~/consts.js";
import { AvailableBackends, type InstallerOptions } from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { logger } from "~/utils/logger.js";

interface LogNextStepsProps {
  projectName?: string;
  frontendDir?: string;
  backendDir?: string;
  packages?: InstallerOptions["packages"];
  backend?: AvailableBackends;
  noInstall?: boolean;
  noVenv?: boolean;
}

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = ({
  projectName = DEFAULT_APP_NAME,
  packages,
  backend,
  frontendDir,
  noInstall,
  noVenv,
}: LogNextStepsProps) => {
  const pkgManager = getUserPkgManager();

  const usingExternalBackend = backend !== "default" && backend !== "trpc";

  logger.info("Next steps:");

  if (usingExternalBackend) {
    if (noVenv) {
      logger.info(`  --setup venv and install dependencies--`);
      // logger.info(`  cd ${projectName}-backend`);
      // logger.info(`  python -m venv venv`);
      // logger.info(`  source venv/bin/activate`);
      // logger.info(`  pip install -r requirements.txt`);
    } else {
      usingExternalBackend && logger.info(`  ${projectName}/backend/run`);
      usingExternalBackend && logger.warn(`  (in another terminal window:)`);
      logger.info(`  cd ${frontendDir}`);
    }
  }

  !usingExternalBackend && projectName !== "." && logger.info(`  cd ${projectName}`);

  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    if (pkgManager === "yarn") {
      logger.info(`  ${pkgManager}`);
    } else {
      logger.info(`  ${pkgManager} install`);
    }
  }

  if (packages?.prisma.inUse) {
    logger.info(`  ${pkgManager === "npm" ? "npx" : pkgManager} prisma db push`);
  }

  logger.info(`  ${pkgManager === "npm" ? "npm run" : pkgManager} dev`);
};
