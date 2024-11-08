import * as p from "@clack/prompts";
import { execa } from "execa";
import { getUserPkgManager, type PackageManager } from "~/utils/getUserPkgManager.js";

type Options = {
  frontendDir: string;
};

/*eslint-disable @typescript-eslint/no-floating-promises*/
const runInstallCommand = async (
  pkgManager: PackageManager,
  frontendDir: string,
): Promise<void> => {
  const s = p.spinner();
  switch (pkgManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case "npm":
      s.start("Installing dependencies with npm...");
      await execa(pkgManager, ["install"], {
        cwd: frontendDir,
        stderr: "inherit",
      });
      s.stop();
      break;

    case "pnpm":
      s.start("Running pnpm install...");
      const pnpmSubprocess = execa(pkgManager, ["install"], {
        cwd: frontendDir,
        stdout: "pipe",
      });

      await new Promise<void>((res, rej) => {
        pnpmSubprocess.stdout?.on("data", (data: Buffer) => {
          const text = data.toString();
          if (text.includes("Progress")) {
            s.message(text.includes("|") ? text.split(" | ")[1] ?? "" : text);
          }
        });
        pnpmSubprocess.on("error", (e) => rej(e));
        pnpmSubprocess.on("close", () => res());
      });
      s.stop();
      break;

    case "yarn":
      s.start("Running yarn...");
      const yarnSubprocess = execa(pkgManager, [], {
        cwd: frontendDir,
        stdout: "pipe",
      });

      await new Promise<void>((res, rej) => {
        yarnSubprocess.stdout?.on("data", (data: Buffer) => {
          s.message(data.toString());
        });
        yarnSubprocess.on("error", (e) => rej(e));
        yarnSubprocess.on("close", () => res());
      });
      s.stop();
      break;
  }
};
/*eslint-enable @typescript-eslint/no-floating-promises*/

export const installDependencies = async ({ frontendDir }: Options) => {
  p.log.info("Installing frontend dependencies...");
  const pkgManager = getUserPkgManager();

  await runInstallCommand(pkgManager, frontendDir);
  p.log.success(`Successfully installed dependencies!\n`);
};
