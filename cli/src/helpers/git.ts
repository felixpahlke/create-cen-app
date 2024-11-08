import * as p from "@clack/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

const isGitInstalled = (dir: string): boolean => {
  try {
    execSync("git --version", { cwd: dir });
    return true;
  } catch (_e) {
    return false;
  }
};

/** @returns Whether or not the provided directory has a `.git` subdirectory in it. */
const isRootGitRepo = (dir: string): boolean => {
  return fs.existsSync(path.join(dir, ".git"));
};

/** @returns Whether or not this directory or a parent directory has a `.git` directory. */
const isInsideGitRepo = async (dir: string): Promise<boolean> => {
  try {
    // If this command succeeds, we're inside a git repo
    await execa("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: dir,
      stdout: "ignore",
    });
    return true;
  } catch (_e) {
    // Else, it will throw a git-error and we return false
    return false;
  }
};

const getGitVersion = () => {
  const stdout = execSync("git --version").toString().trim();
  const gitVersionTag = stdout.split(" ")[2];
  const major = gitVersionTag?.split(".")[0];
  const minor = gitVersionTag?.split(".")[1];
  return { major: Number(major), minor: Number(minor) };
};

/** @returns The git config value of "init.defaultBranch". If it is not set, returns "main". */
const getDefaultBranch = () => {
  const stdout = execSync("git config --global init.defaultBranch || echo main").toString().trim();

  return stdout;
};

// This initializes the Git-repository for the project
export const initializeGit = async (projectDir: string) => {
  p.log.info("Initializing Git...");

  if (!isGitInstalled(projectDir)) {
    p.log.warn("Git is not installed. Skipping Git initialization.");
    return;
  }

  p.log.info("Creating a new git repo...");

  const isRoot = isRootGitRepo(projectDir);
  const isInside = await isInsideGitRepo(projectDir);
  const dirName = path.parse(projectDir).name; // skip full path for logging

  if (isInside && isRoot) {
    // Dir is a root git repo
    const overwriteGit = await p.confirm({
      message: `${chalk.redBright.bold(
        "Warning:",
      )} Git is already initialized in "${dirName}". Initializing a new git repository would delete the previous history. Would you like to continue anyways?`,
      initialValue: false,
    });

    if (!overwriteGit) {
      p.log.info("Skipping Git initialization.");
      return;
    }
    // Deleting the .git folder
    fs.removeSync(path.join(projectDir, ".git"));
  } else if (isInside && !isRoot) {
    // Dir is inside a git worktree
    const initializeChildGitRepo = await p.confirm({
      message: `${chalk.redBright.bold(
        "Warning:",
      )} "${dirName}" is already in a git worktree. Would you still like to initialize a new git repository in this directory?`,
      initialValue: false,
    });

    if (!initializeChildGitRepo) {
      p.log.info("Skipping Git initialization.");
      return;
    }
  }

  // We're good to go, initializing the git repo
  try {
    const branchName = getDefaultBranch();

    // --initial-branch flag was added in git v2.28.0
    const { major, minor } = getGitVersion();
    if (major < 2 || (major == 2 && minor < 28)) {
      await execa("git", ["init"], { cwd: projectDir });
      // symbolic-ref is used here due to refs/heads/master not existing
      // It is only created after the first commit
      // https://superuser.com/a/1419674
      await execa("git", ["symbolic-ref", "HEAD", `refs/heads/${branchName}`], {
        cwd: projectDir,
      });
    } else {
      await execa("git", ["init", `--initial-branch=${branchName}`], {
        cwd: projectDir,
      });
    }
    await execa("git", ["add", "."], { cwd: projectDir });
    p.log.success(`Successfully initialized and staged ${chalk.green.bold("git")}\n`);
  } catch (error) {
    // Safeguard, should be unreachable
    p.log.error(`Failed: could not initialize git. Update git to the latest version!\n`);
  }
};
