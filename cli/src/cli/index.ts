import * as p from "@clack/prompts";
import { isCancel } from "@clack/prompts";
import chalk from "chalk";
import { Command } from "commander";
import { CREATE_CEN_APP, DEFAULT_APP_NAME, DEFAULT_DISPLAY_NAME } from "~/consts.js";
import {
  type AvailableBackends,
  AvailableFlavours,
  availablePackages,
  type AvailablePackages,
  backendsDisplayList,
  flavourDisplayList,
  TemplateDisplay,
  templateDisplayList,
} from "~/installers/index.js";
import { getVersion } from "~/utils/getCENVersion.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { PythonVersion, getUserPythonVersions } from "~/utils/getUserPythonVersion.js";
import { validateAppName } from "~/utils/validateAppName.js";

interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  noVenv: boolean;
  default: boolean;
  proxy: boolean;
}

interface CliResults {
  appName: string;
  flavour: AvailableFlavours;
  displayName: string;
  packages: AvailablePackages[];
  backend: AvailableBackends;
  pythonVersion: PythonVersion;
  template: TemplateDisplay;
  flags: CliFlags;
}

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  displayName: DEFAULT_DISPLAY_NAME,
  flavour: "main",
  packages: ["tailwind", "envVariables", "carbon", "recoil"],
  backend: "default",
  pythonVersion: { path: "/usr/bin/python3", owner: "system" },
  template: templateDisplayList[0]!,
  flags: {
    noGit: false,
    noInstall: false,
    noVenv: false,
    default: false,
    proxy: false,
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
      const template = await p.select({
        message: "Which template would you like to use?",
        options: templateDisplayList.map((template) => ({
          label: chalk.bold(template.name),
          hint: template.description,
          value: template,
        })),
        initialValue: templateDisplayList[0]!,
      });

      if (isCancel(template)) {
        p.cancel("Operation cancelled");
        process.exit(0);
      }

      cliResults.template = template as TemplateDisplay;

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

      if (cliResults.template.value === "create-cen-app") {
        const language = await p.select({
          message: "Will you be using TypeScript or JavaScript?",
          options: [
            { label: "TypeScript", value: "typescript" },
            { label: "JavaScript", value: "javascript" },
          ],
          initialValue: "typescript",
        });

        if (isCancel(language)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        if (language === "javascript") {
          p.note(chalk.redBright("Wrong answer, using TypeScript instead"));
        }

        const packages = await p.multiselect({
          message: "Which packages would you like to enable? (Space to select. A to toggle all)",
          options: availablePackages
            .filter((pkg) => pkg !== "envVariables" && pkg !== "trpc")
            .map((pkgName) => ({
              label: pkgName,
              value: pkgName,
            })),
        });

        if (isCancel(packages)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        cliResults.packages = packages as AvailablePackages[];

        const backend = await p.select({
          message: "Which backend would you like to use?",
          options: backendsDisplayList.map((backend) => ({
            label: backend.name,
            value: backend.value,
          })),
          initialValue: "default",
        });

        if (isCancel(backend)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        cliResults.backend = backend as AvailableBackends;

        const proxy =
          backend === "fastapi"
            ? true
            : await p.confirm({
                message: "Would you like us to setup a proxy on /api for you?",
                initialValue: true,
              });

        if (isCancel(proxy)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        cliResults.flags.proxy = proxy as boolean;

        if (!cliResults.flags.noInstall) {
          const pkgManager = getUserPkgManager();
          const command = pkgManager === "yarn" ? pkgManager : `${pkgManager} install`;
          const install = await p.confirm({
            message: `Would you like us to run ${chalk.magenta(`'${command}'`)}?`,
            initialValue: true,
          });

          if (isCancel(install)) {
            p.cancel("Operation cancelled");
            process.exit(0);
          }

          cliResults.flags.noInstall = !install;
        }

        if (!cliResults.flags.noGit) {
          const git = await p.confirm({
            message: "Initialize a new git repository?",
            initialValue: true,
          });

          if (isCancel(git)) {
            p.cancel("Operation cancelled");
            process.exit(0);
          }

          cliResults.flags.noGit = !git;
        }

        if (cliResults.backend === "fastapi") {
          await handleFastAPISetup(cliResults);
        }
      }
      // install dependencies for full-stack template
      if (cliResults.template.value === "full-stack-cen-template") {
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
              flavour === "backend-only"
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

        // if (!cliResults.flags.noGit) {
        //   const git = await p.confirm({
        //     message: "Initialize a new git repository?",
        //     initialValue: true,
        //   });

        //   if (isCancel(git)) {
        //     p.cancel("Operation cancelled");
        //     process.exit(0);
        //   }

        //   cliResults.flags.noGit = !git;
        // }

        // we are handling this in full-stack-installer.ts
        cliResults.flags.noGit = true;
      }
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

const handleFastAPISetup = async (cliResults: CliResults): Promise<void> => {
  if (!cliResults.flags.noVenv) {
    const setupVenv = await p.confirm({
      message: `Would you like us to setup your ${chalk.magenta(
        "python environment (venv)",
      )}? ${chalk.yellow("experimental")}`,
      initialValue: true,
    });

    if (isCancel(setupVenv)) {
      p.cancel("Operation cancelled");
      process.exit(0);
    }

    cliResults.flags.noVenv = !setupVenv;

    if (!cliResults.flags.noVenv) {
      const pythonVersions = await getUserPythonVersions();

      const pythonVersionSupported = pythonVersions?.some((version) => {
        const match = version.version?.match(/3\.(\d+)/);
        if (!match) return false;
        const minorVersion = Number(match[1]);
        return minorVersion >= 10;
      });

      if (!pythonVersionSupported) {
        p.log.warn(
          "This backend requires Python 3.10 or higher but we couldn't find it on your system. Please install and follow the Backend README to setup your environment.",
        );
        cliResults.flags.noVenv = true;
      }

      if (!cliResults.flags.noVenv && pythonVersions?.[0]) {
        const pythonVersion = await p.select({
          message:
            "Which python version would you like to use? We found these Versions on your system:",
          options: pythonVersions.map((version) => ({
            label: `${version.version} - ${version.path}`,
            value: version,
          })),
        });

        if (isCancel(pythonVersion)) {
          p.cancel("Operation cancelled");
          process.exit(0);
        }

        cliResults.pythonVersion = pythonVersion as PythonVersion;
      }
    }
  }
};
