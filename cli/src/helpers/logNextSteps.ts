import * as p from "@clack/prompts";
import chalk from "chalk";
import { DEFAULT_APP_NAME } from "~/consts.js";
import {
  AvailableBackends,
  AvailableTemplates,
  type InstallerOptions,
} from "~/installers/index.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";

interface LogNextStepsProps {
  projectName: string;
  frontendDir?: string;
  backendDir?: string;
  packages?: InstallerOptions["packages"];
  backend: AvailableBackends;
  noInstall?: boolean;
  noVenv: boolean;
  template: AvailableTemplates;
  missingDependencies: string[];
}

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = ({
  projectName = DEFAULT_APP_NAME,
  packages,
  backend,
  frontendDir,
  noInstall,
  noVenv,
  template,
  missingDependencies,
}: LogNextStepsProps) => {
  p.log.info(`${chalk.bold.green("All done!")} 🎉\n`);

  if (template === "create-cen-app") {
    createCenAppNextSteps({
      projectName,
      noVenv,
      frontendDir: frontendDir ?? "",
      noInstall: noInstall ?? true,
      backend,
    });
  }

  if (template === "full-stack-cen-template") {
    createFullStackCenTemplateNextSteps({ projectName, missingDependencies });
  }
  p.log.message("");
  p.outro(`${chalk.bold.green("Have fun building!")} 🚀`);
};

const createCenAppNextSteps = ({
  projectName,
  noVenv,
  frontendDir,
  noInstall,
  backend,
}: {
  projectName: string;
  noVenv: boolean;
  frontendDir: string;
  noInstall: boolean;
  backend: AvailableBackends;
}) => {
  const pkgManager = getUserPkgManager();
  const usingExternalBackend = backend !== "default" && backend !== "trpc";
  let steps = `${chalk.bold.cyan("Next steps:")}\n\n`;

  if (usingExternalBackend) {
    if (noVenv) {
      steps += `  ${chalk.cyan("--setup venv and install dependencies--")}\n`;
    } else {
      steps += `  ${chalk.cyan("cd")} ${projectName}/backend\n  ${chalk.cyan(
        "./run",
      )}\n\n  ${chalk.yellow("In another terminal window:")}\n\n  ${chalk.cyan(
        "cd",
      )} ${frontendDir}\n`;
    }
  } else if (projectName !== ".") {
    steps += `  ${chalk.cyan("cd")} ${projectName}\n`;
  }

  if (noInstall) {
    // To reflect yarn's default behavior of installing packages when no additional args provided
    steps += `  ${chalk.cyan(pkgManager)}${pkgManager !== "yarn" ? " install" : ""}\n`;
  }

  steps += `  ${chalk.cyan(pkgManager === "npm" ? "npm run" : pkgManager)} dev\n`;
  p.log.info(steps);
};

const createFullStackCenTemplateNextSteps = ({
  projectName,
  missingDependencies,
}: {
  projectName: string;
  missingDependencies: string[];
}) => {
  p.log.info(
    `${chalk.bold.cyan("Next steps:")}\n\n${
      missingDependencies.length > 0
        ? `  ${chalk.yellow("Install missing dependencies:")} ${missingDependencies.join(", ")}\n\n`
        : ""
    }  ${chalk.cyan("cd")} ${projectName}\n  ${chalk.cyan("docker compose watch")}`,
  );
};
