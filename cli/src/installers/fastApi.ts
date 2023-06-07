import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { getUserPythonInfo } from "~/utils/getUserPythonVersion.js";
import { logger } from "~/utils/logger.js";

export const fastApiInstaller = async () => {
  const destDir = path.resolve(process.cwd(), "fastapi");
  const srcDir = path.join(PKG_ROOT, "template/extras/backends/fastapi");

  // copy the template to separate folder
  fs.copySync(srcDir, destDir);

  logger.info("Preparing FastAPI environment...");

  const pythonInfo = await getUserPythonInfo();

  if (!pythonInfo.installed) {
    logger.warn(`Python is not installed. We cannot setup the fastAPI environment for you.`);
  } else {
    const spinner = ora(`Creating virtual environment...`).start();
    await execa(pythonInfo.alias!, ["-m", "venv", "venv"], {
      cwd: destDir,
      stdio: "inherit",
    });
    spinner.succeed(chalk.green(`Successfully created virtual environment for FastAPI`));

    // instal python requirements in venv
    const spinner2 = ora(`Installing python requirements...`).start();
    await execa("venv/bin/pip", ["install", "-r", "requirements.txt"], {
      cwd: destDir,
      stderr: "inherit",
    });
    spinner2.succeed(chalk.green(`Successfully installed python requirements`));
  }
};
