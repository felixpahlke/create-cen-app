import { AvailableEnvVars } from "./index.js";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT, WATSONX_BRANCH, WATSONX_REPO } from "~/consts.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";
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
  const s = p.spinner();
  s.start(`Cloning WatsonX repository...`);
  await execa("git", ["clone", "-b", WATSONX_BRANCH, WATSONX_REPO, backendDir], {
    cwd: PKG_ROOT,
    stdio: "inherit",
  });
  s.stop();
  p.log.success(`Successfully cloned ${chalk.green.bold("WatsonX")} repository\n`);

  // delete .git folder
  s.start(`Cleaning up...`);
  fs.removeSync(path.join(backendDir, ".git"));
  s.stop();
  p.log.success(`Successfully cleaned up\n`);

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
    p.log.info("Skipping FastAPI environment setup");
    return;
  }

  p.log.info("Preparing Python environment...");

  const poetryInstalled = await execa("poetry", ["--version"])
    .then(() => true)
    .catch(() => false);

  const python311Installed = await execa("python3.11", ["--version"])
    .then(() => true)
    .catch(() => false);

  if (!poetryInstalled) {
    p.log.error("Poetry is not installed. Please install poetry and follow the Backend README.");
    return;
  }

  if (!python311Installed) {
    p.log.error(
      "Python 3.11 is not installed. Please install Python 3.11 and follow the Backend README.",
    );
    return;
  }

  s.start(`Creating virtual environment...`);

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

  s.stop();
  p.log.success(`Successfully installed ${chalk.green.bold("python")} requirements\n`);

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
