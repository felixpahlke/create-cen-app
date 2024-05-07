import { AvailableEnvVars } from "./index.js";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { PKG_ROOT, WATSONX_REPO } from "~/consts.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";
import { logger } from "~/utils/logger.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";

interface WatsonXInstallerOptions {
  backendDir: string;
  frontendDir: string;
  noVenv: boolean;
  pythonVersion: PythonVersion;
  envVars?: Record<AvailableEnvVars, string>;
}

export const watsonxInstaller = async ({
  backendDir,
  frontendDir,
  noVenv,
  pythonVersion,
  envVars,
}: WatsonXInstallerOptions) => {
  // pull the repo from WATSONX_REPO into backend folder
  let spinner = ora(`Cloning WatsonX repository...`).start();
  await execa("git", ["clone", WATSONX_REPO, backendDir], {
    cwd: PKG_ROOT,
    stdio: "inherit",
  });
  spinner.succeed(chalk.green(`Successfully cloned WatsonX repository`));

  // delete .git folder
  spinner = ora(`Cleaning up...`).start();
  fs.removeSync(path.join(backendDir, ".git"));
  spinner.succeed(chalk.green(`Successfully cleaned up`));

  // create .env file
  const envDest = path.join(backendDir, ".env");
  fs.copySync(path.join(backendDir, ".env.sample"), envDest);

  // fill in envVars
  if (envVars) {
    // replace <INSERT_KEY> in .env file
    if (envVars.IBM_API_KEY) {
      replaceTextInFiles(envDest, "<INSERT_KEY>", envVars.IBM_API_KEY);
    }
    if (envVars.WATSONX_PROJECT_ID) {
      replaceTextInFiles(envDest, "<INSERT_WATSONX_PROJECT_ID>", envVars.WATSONX_PROJECT_ID);
    }
  }

  // copy over useStream hook
  const useStreamSrc = path.join(PKG_ROOT, "template/extras/src/hooks/useStream.ts");
  const useStreamDest = path.join(frontendDir, "src/hooks/useStream.ts");
  fs.copySync(useStreamSrc, useStreamDest);

  if (noVenv) {
    logger.info("Skipping FastAPI environment setup");
    return;
  }

  logger.info("Preparing Python environment...");

  const poetryInstalled = await execa("poetry", ["--version"])
    .then(() => true)
    .catch(() => false);

  const python311Installed = await execa("python3.11", ["--version"])
    .then(() => true)
    .catch(() => false);

  if (!poetryInstalled) {
    logger.error("Poetry is not installed. Please install poetry and follow the Backend README.");
    return;
  }

  if (!python311Installed) {
    logger.error(
      "Python 3.11 is not installed. Please install Python 3.11 and follow the Backend README.",
    );
    return;
  }

  spinner = ora(`Creating virtual environment...`).start();

  await execa("poetry", ["config", "virtualenvs.in-project", "true"], {
    cwd: backendDir,
    stdio: "inherit",
  });

  // TODO: check if this version is available
  await execa("poetry", ["env", "use", "3.11"], {
    cwd: backendDir,
    stdio: "inherit",
  });

  await execa("poetry", ["install"], {
    cwd: backendDir,
    stdio: "inherit",
  });

  spinner.succeed(chalk.green(`Successfully installed python requirements`));

  //   await execa(pythonVersion.path, ["-m", "venv", ".venv"], {
  //     cwd: backendDir,
  //     stdio: "inherit",
  //   });
  //   spinner.succeed(chalk.green(`Successfully created virtual environment for FastAPI`));

  //   // instal python requirements in venv
  //   const spinner2 = ora(`Installing python requirements...`).start();
  //   await execa(".venv/bin/pip", ["install", "-r", "requirements.txt"], {
  //     cwd: backendDir,
  //     stdio: "inherit",
  //   });
};
