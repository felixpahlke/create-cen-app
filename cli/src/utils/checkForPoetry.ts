import { execa } from "execa";

export const checkForPoetry = async () => {
  const poetryInstalled = await execa("poetry", ["--version"])
    .then(() => true)
    .catch(() => false);
  return poetryInstalled;
};
