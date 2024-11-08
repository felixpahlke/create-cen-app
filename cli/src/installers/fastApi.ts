import * as p from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { PythonVersion } from "~/utils/getUserPythonVersion.js";

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
    p.log.info("Skipping FastAPI environment setup");
    return;
  }

  p.log.info("Preparing FastAPI environment...");

  // const pythonVersions = await getUserPythonVersions();
  // const pythonVersion = pythonVersions?.[0];

  const s = p.spinner();
  s.start("Creating virtual environment...");
  await execa(pythonVersion.path, ["-m", "venv", ".venv"], {
    cwd: destDir,
    stdio: "inherit",
  });
  s.stop();
  p.log.success(`Successfully created virtual environment for ${chalk.green.bold("FastAPI")}`);

  // instal python requirements in venv
  const s2 = p.spinner();
  s2.start("Installing python requirements...");
  await execa(".venv/bin/pip", ["install", "-r", "requirements.txt"], {
    cwd: destDir,
    stdio: "inherit",
  });
  s2.stop();
  p.log.success(`Successfully installed python requirements`);
};
