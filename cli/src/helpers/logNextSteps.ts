import * as p from "@clack/prompts";
import chalk from "chalk";
import { DEFAULT_APP_NAME } from "~/consts.js";
import { AvailableFlavours } from "~/installers/index.js";

interface LogNextStepsProps {
  projectName: string;
  noInstall: boolean;
  missingDependencies: string[];
  flavour: AvailableFlavours;
}

// This logs the next steps that the user should take in order to advance the project
export const logNextSteps = ({
  projectName = DEFAULT_APP_NAME,
  flavour,
  //TODO: add next-steps message if noInstall is true
  noInstall,
  missingDependencies,
}: LogNextStepsProps) => {
  p.log.info(`${chalk.bold.green("All done!")} 🎉\n`);

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

  p.log.message("");
  p.outro(`${chalk.bold.green("Have fun building!")} 🚀`);
};
