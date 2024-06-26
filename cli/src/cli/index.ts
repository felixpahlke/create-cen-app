import chalk from "chalk";
import { Command } from "commander";
import inquirer from "inquirer";
import { CREATE_CEN_APP, DEFAULT_APP_NAME, DEFAULT_DISPLAY_NAME } from "~/consts.js";
import {
  type AvailableBackends,
  availablePackages,
  type AvailablePackages,
  BackendDisplay,
  backendsDisplayList,
  AvailableEnvVars,
  availableEnvVars,
} from "~/installers/index.js";
import { checkForPoetry } from "~/utils/checkForPoetry.js";
import { getVersion } from "~/utils/getCENVersion.js";
import { getUserPkgManager } from "~/utils/getUserPkgManager.js";
import { PythonVersion, getUserPythonVersions } from "~/utils/getUserPythonVersion.js";
import { logger } from "~/utils/logger.js";
import { validateAppName } from "~/utils/validateAppName.js";

interface CliFlags {
  noGit: boolean;
  noInstall: boolean;
  noVenv: boolean;
  default: boolean;

  /** @internal Used in CI. */
  CI: boolean;
  /** @internal Used in CI. */
  tailwind: boolean;
  /** @internal Used in CI. */
  trpc: boolean;
  /** @internal Used in CI. */
  proxy: boolean;
  // prisma: boolean;
  // /** @internal Used in CI. */
  // nextAuth: boolean;
}

interface CliResults {
  appName: string;
  displayName: string;
  packages: AvailablePackages[];
  backend: AvailableBackends;
  pythonVersion: PythonVersion;
  envVars: Record<AvailableEnvVars, string>;
  flags: CliFlags;
}

const defaultOptions: CliResults = {
  appName: DEFAULT_APP_NAME,
  displayName: DEFAULT_DISPLAY_NAME,
  packages: ["tailwind", "envVariables", "carbon", "recoil"],
  backend: "default",
  pythonVersion: { path: "/usr/bin/python3", owner: "system" },
  envVars: {},
  flags: {
    noGit: false,
    noInstall: false,
    noVenv: false,
    default: false,
    CI: false,
    tailwind: true,
    trpc: false,
    proxy: false,
    // prisma: false,
    // nextAuth: false,
  },
};

export const runCli = async () => {
  const cliResults = defaultOptions;

  const program = new Command().name(CREATE_CEN_APP);

  // TODO: This doesn't return anything typesafe. Research other options?
  // Emulate from: https://github.com/Schniz/soundtype-commander
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
    /** START CI-FLAGS */
    /**
     * @experimental Used for CI E2E tests. If any of the following option-flags are provided, we
     *               skip prompting.
     */
    .option("--CI", "Boolean value if we're running in CI", false)
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--tailwind [boolean]",
      "Experimental: Boolean value if we should install Tailwind CSS. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /** @experimental Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--nextAuth [boolean]",
      "Experimental: Boolean value if we should install NextAuth.js. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--prisma [boolean]",
      "Experimental: Boolean value if we should install Prisma. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    .option(
      "--trpc [boolean]",
      "Experimental: Boolean value if we should install tRPC. Must be used in conjunction with `--CI`.",
      (value) => !!value && value !== "false",
    )
    /** @experimental - Used for CI E2E tests. Used in conjunction with `--CI` to skip prompting. */
    // .option(
    //   "-i, --import-alias",
    //   "Explicitly tell the CLI to use a custom import alias",
    //   defaultOptions.flags.importAlias,
    // )
    /** END CI-FLAGS */
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

  // FIXME: TEMPORARY WARNING WHEN USING YARN 3. SEE ISSUE #57
  if (process.env.npm_config_user_agent?.startsWith("yarn/3")) {
    logger.warn(`  WARNING: It looks like you are using Yarn 3. This is currently not supported,
  and likely to result in a crash. Please run create-cen-app with another
  package manager such as pnpm, npm, or Yarn Classic.
  See: https://github.com/t3-oss/create-t3-app/issues/57`);
  }

  // Needs to be separated outside the if statement to correctly infer the type as string | undefined
  const cliProvidedName = program.args[0];
  if (cliProvidedName) {
    cliResults.appName = cliProvidedName;
  }

  cliResults.flags = program.opts();

  /** @internal Used for CI E2E tests. */
  let CIMode = false;
  if (cliResults.flags.CI) {
    CIMode = true;
    cliResults.packages = [];
    if (cliResults.flags.trpc) cliResults.packages.push("trpc");
    if (cliResults.flags.tailwind) cliResults.packages.push("tailwind");
  }

  // Explained below why this is in a try/catch block
  try {
    if (process.env.TERM_PROGRAM?.toLowerCase().includes("mintty")) {
      logger.warn(`  WARNING: It looks like you are using MinTTY, which is non-interactive. This is most likely because you are 
  using Git Bash. If that's that case, please use Git Bash from another terminal, such as Windows Terminal. Alternatively, you 
  can provide the arguments from the CLI directly: https://create.t3.gg/en/installation#experimental-usage to skip the prompts.`);

      const error = new Error("Non-interactive environment");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).isTTYError = true;
      throw error;
    }

    // if --CI flag is set, we are running in CI mode and should not prompt the user
    // if --default flag is set, we should not prompt the user
    if (!cliResults.flags.default && !CIMode) {
      if (!cliProvidedName) {
        cliResults.appName = await promptAppName();
      }

      cliResults.displayName = await promptDisplayName();

      await promptLanguage();

      // TODO: add more supported packages
      cliResults.packages = await promptPackages();

      // cliResults.flags.importAlias = await promptImportAlias();

      cliResults.backend = await promptBackends();

      if (cliResults.backend === "trpc") {
        cliResults.packages.push("trpc");
      }
      if (cliResults.backend === "default") {
        cliResults.flags.proxy = await promptProxy();
      } else if (cliResults.backend === "fastapi" || cliResults.backend === "watsonx") {
        cliResults.flags.proxy = true;
      }

      if (cliResults.backend === "fastapi") {
        if (!cliResults.flags.noVenv) {
          cliResults.flags.noVenv = !(await promptSetupVenv());
          if (!cliResults.flags.noVenv) {
            const pythonVersions = await getUserPythonVersions();

            if (!pythonVersions || !pythonVersions[0]) {
              logger.warn(
                "We couldn't find any python versions on your system (Maybe we just don't support your OS yet)",
              );
              cliResults.flags.noVenv = true;
            } else {
              cliResults.pythonVersion = await promptPythonVersion(pythonVersions);
              logger.success(
                `Any time! We'll use ${cliResults.pythonVersion.version} on path: ${cliResults.pythonVersion.path}`,
              );
            }
          }
        }
      }

      if (cliResults.backend === "watsonx") {
        cliResults.envVars = await promptEnvVars();

        if (!cliResults.flags.noVenv) {
          cliResults.flags.noVenv = !(await promptSetupVenv());
          if (!cliResults.flags.noVenv) {
            const pythonVersions = await getUserPythonVersions();
            const poetryInstalled = await checkForPoetry();

            const python311Installed = pythonVersions
              ? pythonVersions.some((version) => version.version?.includes("3.11."))
              : false;

            if (!python311Installed) {
              logger.warn(
                "This backend requires Python 3.11, but we couldn't find it on your system. Please install and follow the Backend README to setup your environment.",
              );
              cliResults.flags.noVenv = true;
            }
            if (!poetryInstalled) {
              logger.warn(
                "This backend requires Poetry, but we couldn't find it on your system. Please install and follow the Backend README to setup your environment.",
              );
              cliResults.flags.noVenv = true;
            }
          }
        }
      }

      if (!cliResults.flags.noInstall) {
        cliResults.flags.noInstall = !(await promptInstall());
      }

      if (!cliResults.flags.noGit) {
        cliResults.flags.noGit = !(await promptGit());
      }
    }
  } catch (err) {
    // If the user is not calling create-cen-app from an interactive terminal, inquirer will throw an error with isTTYError = true
    // If this happens, we catch the error, tell the user what has happened, and then continue to run the program with a default CEN app
    // Otherwise we have to do some fancy namespace extension logic on the Error type which feels overkill for one line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (err instanceof Error && (err as any).isTTYError) {
      logger.warn(`
  ${CREATE_CEN_APP} needs an interactive terminal to provide options`);

      const { shouldContinue } = await inquirer.prompt<{
        shouldContinue: boolean;
      }>({
        name: "shouldContinue",
        type: "confirm",
        message: `Continue scaffolding a default CEN app?`,
        default: true,
      });

      if (!shouldContinue) {
        logger.info("Exiting...");
        process.exit(0);
      }

      logger.info(`Bootstrapping a default CEN app in ./${cliResults.appName}`);
    } else {
      throw err;
    }
  }

  return cliResults;
};

const promptAppName = async (): Promise<string> => {
  const { appName } = await inquirer.prompt<Pick<CliResults, "appName">>({
    name: "appName",
    type: "input",
    message: "What will your project be called?",
    default: defaultOptions.appName,
    validate: validateAppName,
    transformer: (input: string) => {
      return input.trim();
    },
  });

  return appName;
};

const promptDisplayName = async (): Promise<string> => {
  const { displayName } = await inquirer.prompt<Pick<CliResults, "displayName">>({
    name: "displayName",
    type: "input",
    message: "What should be the displayed Name in your Application?",
    default: defaultOptions.displayName,
    // validate: validateAppName, TODO: add validation
    transformer: (input: string) => {
      return input.trim();
    },
  });

  return displayName;
};

const promptLanguage = async (): Promise<void> => {
  const { language } = await inquirer.prompt<{ language: string }>({
    name: "language",
    type: "list",
    message: "Will you be using TypeScript or JavaScript?",
    choices: [
      { name: "TypeScript", value: "typescript", short: "TypeScript" },
      { name: "JavaScript", value: "javascript", short: "JavaScript" },
    ],
    default: "typescript",
  });

  if (language === "javascript") {
    logger.error("Wrong answer, using TypeScript instead...");
  } else {
    logger.success("Good choice! Using TypeScript!");
  }
};

// TODO: add more supported packages
const promptPackages = async (): Promise<AvailablePackages[]> => {
  const { packages } = await inquirer.prompt<Pick<CliResults, "packages">>({
    name: "packages",
    type: "checkbox",
    message: "Which packages would you like to enable?",
    choices: availablePackages
      .filter((pkg) => pkg !== "envVariables" && pkg !== "trpc") // don't prompt for env-vars or trpc (this one is prompted in backend selection)
      .map((pkgName) => ({
        name: pkgName,
        checked: false,
      })),
  });

  return packages;
};

const promptBackends = async (): Promise<AvailableBackends> => {
  const { backend } = await inquirer.prompt<{ backend: AvailableBackends }>({
    name: "backend",
    type: "list",
    message: "Which backend would you like to use?",
    choices: backendsDisplayList.map((backendDisplay: BackendDisplay) => backendDisplay),
    default: "default",
  });

  return backend;
};

// asks if frontend dependencies should be installed
const promptInstall = async (): Promise<boolean> => {
  const pkgManager = getUserPkgManager();

  const { install } = await inquirer.prompt<{ install: boolean }>({
    name: "install",
    type: "confirm",
    message: `Would you like us to run ${chalk.magenta(
      `'${pkgManager}` + (pkgManager === "yarn" ? `'?` : ` install'?`),
    )}`,
    default: true,
  });

  if (install) {
    logger.success("Alright. We'll install the dependencies for you!");
  } else {
    if (pkgManager === "yarn") {
      logger.info(`No worries. You can run '${pkgManager}' later to install the dependencies.`);
    } else {
      logger.info(
        `No worries. You can run '${pkgManager} install' later to install the dependencies.`,
      );
    }
  }

  return install;
};

const promptProxy = async (): Promise<boolean> => {
  const { proxy } = await inquirer.prompt<{ proxy: boolean }>({
    name: "proxy",
    type: "confirm",
    message: `Would you like us to setup a proxy on /api for you?`,
    default: true,
  });

  return proxy;
};

// only for FastAPI
const promptSetupVenv = async (): Promise<boolean> => {
  const { install: setupVenv } = await inquirer.prompt<{ install: boolean }>({
    name: "install",
    type: "confirm",
    message: `Would you like us to setup your ${chalk.magenta(
      "python environment (venv)",
    )}? ${chalk.yellow("experimental")}`,
    default: true,
  });

  return setupVenv;
};

const promptEnvVars = async (): Promise<Record<AvailableEnvVars, string>> => {
  logger.info(
    chalk.bold("You can set values for the following environment variables (Leave empty to skip):"),
  );
  const envVars: Record<AvailableEnvVars, string> = {};
  for (const envVar of availableEnvVars) {
    const { value } = await inquirer.prompt<{ value: string }>({
      name: "value",
      type: "input",
      message: `${envVar}=`,
    });
    envVars[envVar] = value;
  }

  return envVars;
};

const promptPythonVersion = async (availableVersions: PythonVersion[]): Promise<PythonVersion> => {
  const { pythonVersion } = await inquirer.prompt<{ pythonVersion: PythonVersion }>({
    name: "pythonVersion",
    type: "list",
    message: `Which python version would you like to use? We found these Versions on your system:`,
    choices: availableVersions.map((version) => ({
      name: `${version.version} - ${version.path}`,
      value: version,
    })),
    // default: true,
  });

  return pythonVersion;
};

const promptGit = async (): Promise<boolean> => {
  const { git } = await inquirer.prompt<{ git: boolean }>({
    name: "git",
    type: "confirm",
    message: "Initialize a new git repository?",
    default: true,
  });

  if (git) {
    logger.success("Nice one! Initializing repository!");
  } else {
    logger.info("Sounds good! You can come back and run git init later.");
  }

  return git;
};
