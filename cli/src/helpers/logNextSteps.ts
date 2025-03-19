import * as p from "@clack/prompts";
import chalk from "chalk";
import { DEFAULT_APP_NAME } from "~/consts.js";
import {
  AvailableBackends,
  AvailableFlavours,
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
  flavour: AvailableFlavours;
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
  flavour,
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
    createFullStackCenTemplateNextSteps({ projectName, flavour, missingDependencies });
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
  flavour,
  missingDependencies,
}: {
  projectName: string;
  flavour: AvailableFlavours;
  missingDependencies: string[];
}) => {
  // Log git config note before next steps

  let gitNote = `${chalk.bold.cyan("Note:")}\n\n`;

  gitNote += `${chalk.cyan(
    "The base template has been registered as upstream, so that you can pull updates later on.\nAdd your own remote as origin and pull updates from upstream:",
  )}\n  
  ${chalk.cyan("git remote add origin <your-remote-url>")}\n  
  ${chalk.cyan("git pull --no-commit upstream " + flavour)}`;

  p.log.info(gitNote);

  let steps = `${chalk.bold.cyan("Next steps:")}\n\n`;

  // Add missing dependencies message if needed
  if (missingDependencies.length > 0) {
    steps += `  ${chalk.yellow("Install missing dependencies:")} ${missingDependencies.join(
      ", ",
    )}\n\n`;
  }

  // Add AppID instructions for oauth-proxy flavor
  if (flavour === "oauth-proxy" || flavour === "oauth-proxy-custom-ui") {
    steps += `  ${chalk.cyan(
      "Get an AppID Instance (see development.md) and put the credentials in .env",
    )}\n\n`;
  }

  // Add standard navigation and startup commands
  steps += `  ${chalk.cyan("cd")} ${projectName}\n`;
  steps += `  ${chalk.cyan("docker compose watch")}\n`;

  p.log.info(steps);
};
