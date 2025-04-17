import * as p from "@clack/prompts";
import { isCancel } from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { CREATE_CEN_APP, DEFAULT_APP_NAME } from "~/consts.js";
import { AvailableFlavours, flavourDisplayList } from "~/installers/index.js";
import { getVersion } from "~/utils/getCENVersion.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { validateAppName } from "~/utils/validateAppName.js";

interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  default: boolean;
}

interface CliResults {
  appName: string;
  flavour: AvailableFlavours;
  flags: CliFlags;
}

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  flavour: "main",
  flags: {
    noGit: false,
    noInstall: false,
    default: false,
  },
};

export const runCli = async () => {
  const cliResults = defaultOptions;
  const program = new Command().name(CREATE_CEN_APP);

  program
    .description("A CLI for creating web applications with the t3 stack")
    .argument(
      "[dir]",
      "The name of the application, as well as the name of the directory to create",
    )
    .option(
      "--noGit",
      "Explicitly tell the CLI to not initialize a new git repo in the project",
      false,
    )
    .option(
      "--noInstall",
      "Explicitly tell the CLI to not run the package manager's install command",
      false,
    )
    .option(
      "-y, --default",
      "Bypass the CLI and use all default options to bootstrap a new cen-app",
      false,
    )
    .version(getVersion(), "-v, --version", "Display the version number")
    .addHelpText(
      "afterAll",
      `\n The t3 stack was inspired by ${chalk
        .hex("#E8DCFF")
        .bold("@t3dotgg")} and has been used to build awesome fullstack applications like ${chalk
        .hex("#E24A8D")
        .underline("https://ping.gg")} \n`,
    )
    .parse(process.argv);

  if (process.env.npm_config_user_agent?.startsWith("yarn/3")) {
    p.log.warn(
      "WARNING: Yarn 3 is currently not supported and may cause crashes. Please use pnpm, npm, or Yarn Classic instead.",
    );
  }

  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  cliResults.flags = program.opts();

  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
      p.log.warn(
        "WARNING: MinTTY detected which is non-interactive. Please use another terminal like Windows Terminal, or provide CLI arguments directly.",
      );
      throw Object.assign(new Error("Non-interactive environment"), { isTTYError: true });
    }

    if (!cliResults.flags.default) {
      if (!cliProvidedName) {
        const appName = await p.text({
          message: "What will your project be called?",
          defaultValue: defaultOptions.appName,
          placeholder: defaultOptions.appName,
          validate: validateAppName,
        });
        if (isCancel(appName)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }
        if (appName) cliResults.appName = appName as string;
      }

      const flavour = await p.select({
        message: "Which flavour would you like to use?",
        options: flavourDisplayList.map((flavour) => ({
          label: flavour.name,
          value: flavour.value,
          hint: flavour.description,
        })),
        initialValue: "default",
      });

      if (isCancel(flavour)) {
        p.cancel("Operation cancelled");
        process.exit(0);
      }

      cliResults.flavour = flavour as AvailableFlavours;

      if (!cliResults.flags.noInstall) {
        const pkgManager = getUserPkgManager();
        const command = pkgManager === "yarn" ? pkgManager : `${pkgManager} install`;
        const setupEnv = await p.confirm({
          message:
            flavour === "backend-only" || flavour === "backend-only-no-db"
              ? `Would you like us to run ${chalk.magenta("'uv sync'")}?`
              : flavour === "go" || flavour === "java"
              ? `Would you like us to run ${chalk.magenta(`'${command}'`)}?`
              : `Would you like us to run ${chalk.magenta(`'${command}'`)} and ${chalk.magenta(
                  "'uv sync'",
                )}?`,
          initialValue: true,
        });

        if (isCancel(setupEnv)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        cliResults.flags.noInstall = !setupEnv;
      }

      cliResults.flags.noGit = true;
    }
  } catch (err) {
    if (err instanceof Error && "isTTYError" in err) {
      p.log.warn(`\n${CREATE_CEN_APP} needs an interactive terminal to provide options`);

      const shouldContinue = await p.confirm({
        message: "Continue scaffolding a default CEN app?",
        initialValue: true,
      });

      if (isCancel(shouldContinue)) {
        p.cancel("Operation cancelled");
        process.exit(0);
      }

      if (!shouldContinue) {
        p.log.info("Exiting...");
        process.exit(0);
      }

      p.log.info(`Bootstrapping a default CEN app in ./${cliResults.appName}`);
    } else {
      throw err;
    }
  }

  return cliResults;
};
