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

export const preflightCheck = async ({
  projectDir,
  projectName,
  template,
  noInstall,
}: PreflightCheckOptions) => {
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

      if (overwriteDir === "abort") {
        p.log.error("Aborting installation...");
        process.exit(1);
      }

      const overwriteAction =
        overwriteDir === "clear" ? "clear the directory" : "overwrite conflicting files";

      const confirmOverwriteDir = await p.confirm({
        message: `Are you sure you want to ${overwriteAction}?`,
        initialValue: false,
      });

      if (!confirmOverwriteDir) {
        p.log.error("Aborting installation...");
        process.exit(1);
      }

      if (overwriteDir === "clear") {
        p.log.info(`\nEmptying ${chalk.cyan.bold(projectName)} and creating CEN app..\n`);
        fs.emptyDirSync(projectDir);
      }
    }
  }

  if (template === "full-stack-cen-template") {
    p.log.info("Checking for dependencies...\n");

    const uvInstalled = await checkIfUvInstalled();
    if (!uvInstalled) {
      if (!noInstall) {
        p.log.error("❌ uv is not installed. Please install uv and try again.");
        p.log.info(
          "Getting started with uv: https://docs.astral.sh/uv/getting-started/installation/",
        );
        process.exit(1);
      } else {
        p.log.warn("⚠️ uv is not installed. You may need to install it later.");
      }
    } else {
      p.log.info("✅ uv is installed");
    }

    const dockerInstalled = await checkIfDockerInstalled();
    if (!dockerInstalled) {
      p.log.warn("⚠️ Docker CLI is not installed. You may need to install it later.");
      p.log.info("Install Docker: https://rancherdesktop.io/ or brew install docker");
    } else {
      p.log.info("✅ Docker is installed");
    }

    const dockerComposeInstalled = await checkIfDockerComposeInstalled();
    if (!dockerComposeInstalled) {
      p.log.warn("⚠️ Docker Compose is not installed. You may need to install it later.");
      p.log.info("Install Docker: https://rancherdesktop.io/ or brew install docker");
    } else {
      p.log.info("✅ Docker Compose is installed");
    }

    const pythonInstalled = await checkIfPythonVersionsInstalled();
    if (!pythonInstalled) {
      if (!noInstall) {
        p.log.error(
          "❌ You need Python 3.10, 3.11, or 3.12 installed to use this template. Please install one of these versions and try again.",
        );
        p.log.info("Install Python: https://www.python.org/downloads/");
        process.exit(1);
      } else {
        p.log.warn("⚠️ Python 3.10+ is not installed. You may need to install it later.");
      }
    } else {
      p.log.info("✅ Python 3.10, 3.11, or 3.12 is installed");
    }

    const nodeInstalled = await checkIfNodeInstalled();
    if (!nodeInstalled) {
      if (!noInstall) {
        p.log.error("❌ Node.js 20.x or higher is required. Please install Node.js and try again.");
        p.log.info("Install Node.js: https://nodejs.org/");
        process.exit(1);
      } else {
        p.log.warn("⚠️ Node.js 20.x or higher is not installed. You may need to install it later.");
      }
    } else {
      p.log.info("✅ Node.js 20.x or higher is installed");
    }
  }
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
    const { stdout } = await execa("docker", ["compose", "--version"]);
    isInstalled = stdout !== "";
  } catch {
    isInstalled = false;
  }

  if (!isInstalled) {
    try {
      const { stdout } = await execa("docker-compose", ["--version"]);
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
