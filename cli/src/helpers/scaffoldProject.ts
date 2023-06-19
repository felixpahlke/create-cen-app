import chalk from "chalk";
import fs from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { type InstallerOptions } from "~/installers/index.js";
import { logger } from "~/utils/logger.js";

type ScaffoldProjectProps = InstallerOptions & {
  projectDir: string;
};

// This bootstraps the base Next.js application
export const scaffoldProject = async ({
  projectName,
  projectDir,
  frontendDir,
  pkgManager,
  noInstall,
}: ScaffoldProjectProps) => {
  const srcDir = path.join(PKG_ROOT, "template/base");

  if (!noInstall) {
    logger.info(`\nUsing: ${chalk.cyan.bold(pkgManager)}\n`);
  } else {
    logger.info("");
  }

  const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start();

  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      if (projectName !== ".")
        spinner.info(`${chalk.cyan.bold(projectName)} exists but is empty, continuing...\n`);
    } else {
      spinner.stopAndPersist();
      const { overwriteDir } = await inquirer.prompt<{
        overwriteDir: "abort" | "clear" | "overwrite";
      }>({
        name: "overwriteDir",
        type: "list",
        message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
          projectName,
        )} already exists and isn't empty. How would you like to proceed?`,
        choices: [
          {
            name: "Abort installation (recommended)",
            value: "abort",
            short: "Abort",
          },
          {
            name: "Clear the directory and continue installation",
            value: "clear",
            short: "Clear",
          },
          {
            name: "Continue installation and overwrite conflicting files",
            value: "overwrite",
            short: "Overwrite",
          },
        ],
        default: "abort",
      });
      if (overwriteDir === "abort") {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === "clear" ? "clear the directory" : "overwrite conflicting files";

      const { confirmOverwriteDir } = await inquirer.prompt<{
        confirmOverwriteDir: boolean;
      }>({
        name: "confirmOverwriteDir",
        type: "confirm",
        message: `Are you sure you want to ${overwriteAction}?`,
        default: false,
      });

      if (!confirmOverwriteDir) {
        spinner.fail("Aborting installation...");
        process.exit(1);
      }

      if (overwriteDir === "clear") {
        spinner.info(`Emptying ${chalk.cyan.bold(projectName)} and creating CEN app..\n`);
        fs.emptyDirSync(projectDir);
      }
    }
  }

  spinner.start();

  // now copying frontend files
  fs.copySync(srcDir, frontendDir);
  fs.renameSync(path.join(frontendDir, "_gitignore"), path.join(frontendDir, ".gitignore"));

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

  spinner.succeed(`${scaffoldedName} ${chalk.green("scaffolded successfully!")}\n`);
};
