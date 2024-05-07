import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";
import { logger } from "~/utils/logger.js";

interface FastApiInstallerOptions {
  backendDir: string;
  noVenv: boolean;
  pythonVersion: PythonVersion;
}

export const fastApiInstaller = async ({
  backendDir,
  noVenv,
  pythonVersion,
}: FastApiInstallerOptions) => {
  const destDir = backendDir;
  const srcDir = path.join(PKG_ROOT, "template/extras/backends/fastapi");

  // copy the template to separate folder
  fs.copySync(srcDir, destDir);
  fs.renameSync(path.join(destDir, "_gitignore"), path.join(destDir, ".gitignore"));

  // create .env file
  const envDest = path.join(backendDir, ".env");
  const envContent = `EXAMPLE=XXXX`;
  fs.writeFileSync(envDest, envContent, "utf-8");

  if (noVenv) {
    logger.info("Skipping FastAPI environment setup");
    return;
  }

  logger.info("Preparing FastAPI environment...");

  // const pythonVersions = await getUserPythonVersions();
  // const pythonVersion = pythonVersions?.[0];

  const spinner = ora(`Creating virtual environment...`).start();
  await execa(pythonVersion.path, ["-m", "venv", ".venv"], {
    cwd: destDir,
    stdio: "inherit",
  });
  spinner.succeed(chalk.green(`Successfully created virtual environment for FastAPI`));

  // instal python requirements in venv
  const spinner2 = ora(`Installing python requirements...`).start();
  await execa(".venv/bin/pip", ["install", "-r", "requirements.txt"], {
    cwd: destDir,
    stdio: "inherit",
  });
  spinner2.succeed(chalk.green(`Successfully installed python requirements`));
};
