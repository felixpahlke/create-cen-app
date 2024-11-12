import * as p from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import { AvailableTemplates, type PkgInstallerMap } from "~/installers/index.js";
import { getUserPythonVersions } from "~/utils/getUserPythonVersion.js";

interface PreflightCheckOptions {
  projectName: string;
  projectDir: string;
  template: AvailableTemplates;
  noInstall: boolean;
}

interface PreflightCheckResult {
  noInstall: boolean;
  missingDependencies: string[];
}

export const preflightCheck = async ({
  projectDir,
  projectName,
  template,
  noInstall,
}: PreflightCheckOptions): Promise<PreflightCheckResult> => {
  if (fs.existsSync(projectDir)) {
    if (fs.readdirSync(projectDir).length === 0) {
      if (projectName !== ".")
        p.log.info(`${chalk.cyan.bold(projectName)} exists but is empty, continuing...\n`);
    } else {
      const overwriteDir = await p.select({
        message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(
          projectName,
        )} already exists and isn't empty. How would you like to proceed?`,
        options: [
          {
            label: "Abort installation (recommended)",
            value: "abort",
          },
          {
            label: "Clear the directory and continue installation",
            value: "clear",
          },
          {
            label: "Continue installation and overwrite conflicting files",
            value: "overwrite",
          },
        ],
      });

      if (p.isCancel(overwriteDir) || overwriteDir === "abort") {
        p.log.error("Aborting installation...");
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === "clear" ? "clear the directory" : "overwrite conflicting files";

      const confirmOverwriteDir = await p.confirm({
        message: `Are you sure you want to ${overwriteAction}?`,
        initialValue: false,
      });

      if (p.isCancel(confirmOverwriteDir) || !confirmOverwriteDir) {
        p.log.error("Aborting installation...");
        process.exit(1);
      }

      if (overwriteDir === "clear") {
        p.log.info(`\nEmptying ${chalk.cyan.bold(projectName)} and creating CEN app..\n`);
        fs.emptyDirSync(projectDir);
      }
    }
  }

  let shouldSetNoInstall = noInstall;
  let missingDependencies: string[] = [];
  let missingCriticalDependencies: string[] = [];

  if (template === "full-stack-cen-template") {
    p.log.info("Checking for dependencies...\n");

    const uvInstalled = await checkIfUvInstalled();
    if (!uvInstalled) {
      missingCriticalDependencies.push("uv");
      p.log.error(chalk.red("❌ uv is not installed"));
      p.log.message(
        chalk.cyan.bold("Install uv: https://docs.astral.sh/uv/getting-started/installation/"),
      );
    } else {
      p.log.success(`${chalk.green("uv is installed")}`);
    }

    const dockerInstalled = await checkIfDockerInstalled();
    if (!dockerInstalled) {
      missingDependencies.push("Docker CLI");
      p.log.warn(chalk.yellow("Docker CLI is not installed"));
      p.log.message(chalk.cyan.bold("Install Docker with Homebrew: brew install docker\n"));
      p.log.message(
        chalk.cyan.bold("Install Docker Runtime (colima): https://github.com/abiosoft/colima/ "),
      );
    } else {
      p.log.success(`${chalk.green("Docker CLI is installed")}`);

      const dockerComposeInstalled = await checkIfDockerComposeInstalled();
      if (!dockerComposeInstalled) {
        missingDependencies.push("Docker Compose");
        p.log.warn(chalk.yellow("Docker Compose is not available"));
        p.log.message(
          chalk.cyan.bold("Install Docker Compose with Homebrew: brew install docker-compose\n"),
        );
        p.log.message(
          chalk.cyan.bold("Install Docker Runtime (colima): https://github.com/abiosoft/colima/ "),
        );
      } else {
        p.log.success(`${chalk.green("Docker Compose is installed")}`);
      }
    }

    const pythonInstalled = await checkIfPythonVersionsInstalled();
    if (!pythonInstalled) {
      missingCriticalDependencies.push("Python 3.10+");
      p.log.error(
        chalk.red("❌ You need Python 3.10, 3.11, or 3.12 installed to use this template"),
      );
      p.log.message(chalk.cyan.bold("Install Python: https://www.python.org/downloads/"));
    } else {
      p.log.success(`${chalk.green("Python 3.10, 3.11, or 3.12 is installed")}`);
    }

    const nodeInstalled = await checkIfNodeInstalled();
    if (!nodeInstalled) {
      missingCriticalDependencies.push("Node.js 20+");
      p.log.error(chalk.red("❌ You need Node.js 20.x or higher to use this template"));
      p.log.message(chalk.cyan.bold("Install Node.js: https://nodejs.org/"));
    } else {
      p.log.success(`${chalk.green("Node.js 20.x or higher is installed")}`);
    }

    if (missingDependencies.length > 0 || missingCriticalDependencies.length > 0) {
      const missingMsg = `Missing dependencies: ${[
        ...missingCriticalDependencies,
        ...missingDependencies,
      ].join(", ")}`;

      p.log.warn(chalk.yellow(missingMsg));
      const continueAnyway = await p.confirm({
        message: `Would you like to continue anyway?`,
        initialValue: missingCriticalDependencies.length === 0,
      });

      if (p.isCancel(continueAnyway) || !continueAnyway) {
        p.log.error(chalk.red("Aborting installation..."));
        process.exit(1);
      }

      if (missingCriticalDependencies.length > 0) {
        shouldSetNoInstall = true;
      }
    }
  }

  return {
    noInstall: shouldSetNoInstall,
    missingDependencies: [...missingCriticalDependencies, ...missingDependencies],
  };
};

export const checkIfUvInstalled = async () => {
  try {
    const { stdout } = await execa("uv", ["--version"]);
    return stdout !== "";
  } catch {
    return false;
  }
};

const checkIfDockerInstalled = async () => {
  try {
    const { stdout } = await execa("docker", ["--version"]);
    return stdout !== "";
  } catch {
    return false;
  }
};

const checkIfDockerComposeInstalled = async () => {
  let isInstalled = false;

  try {
    const { stdout } = await execa("docker", ["compose", "version"]);
    isInstalled = stdout !== "";
  } catch {
    isInstalled = false;
  }

  if (!isInstalled) {
    try {
      const { stdout } = await execa("docker-compose", ["version"]);
      isInstalled = stdout !== "";
    } catch {
      isInstalled = false;
    }
  }
  return isInstalled;
};

const checkIfPythonVersionsInstalled = async () => {
  const supportedVersions = ["3.10", "3.11", "3.12"];

  const pythonVersions = await getUserPythonVersions();

  if (!pythonVersions) {
    return false;
  }
  const versions = pythonVersions
    .map((pv) => pv.version?.match(/(\d+\.\d+\.\d+)$/)?.[1])
    .filter((v): v is string => v !== undefined);

  return versions.some((v) => supportedVersions.some((sv) => v.startsWith(sv)));
};

const checkIfNodeInstalled = async () => {
  try {
    const { stdout } = await execa("node", ["--version"]);
    // Node version output format is 'v20.x.x'
    const version = stdout?.slice(1).split(".")[0];
    return version ? parseInt(version) >= 20 : false;
  } catch {
    return false;
  }
};
