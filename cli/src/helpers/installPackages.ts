import * as p from "@clack/prompts";
import chalk from "chalk";
import { type InstallerOptions, type PkgInstallerMap } from "~/installers/index.js";

type InstallPackagesOptions = {
  packages: PkgInstallerMap;
} & InstallerOptions;
// This runs the installer for all the packages that the user has selected
export const installPackages = (options: InstallPackagesOptions) => {
  const { packages } = options;
  p.log.info("Adding boilerplate...");

  for (const [name, pkgOpts] of Object.entries(packages)) {
    if (pkgOpts.inUse) {
      // const s = p.spinner();
      // s.start(`Boilerplating ${name}...`);
      pkgOpts.installer(options);
      // s.stop();
      p.log.success(`Successfully setup boilerplate for ${chalk.green.bold(name)}`);
    }
  }
};
