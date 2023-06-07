import { execa } from "execa";

export type PythonInfo = {
  installed: boolean;
  alias?: "python" | "python3";
  version?: string;
};

export const getUserPythonInfo = async (): Promise<PythonInfo> => {
  const pythonVersion = await checkPythonVersion();
  const python3Version = await checkPython3Version();

  if (pythonVersion) {
    return { installed: true, alias: "python", version: pythonVersion };
  } else if (python3Version) {
    return { installed: true, alias: "python3", version: python3Version };
  } else {
    return { installed: false };
  }
};

async function checkPythonVersion(): Promise<string | null> {
  try {
    const { stdout } = await execa("python", ["--version"]);
    return stdout.trim(); // Python version information
  } catch (error) {
    return null; // Python not found
  }
}

async function checkPython3Version(): Promise<string | null> {
  try {
    const { stdout } = await execa("python3", ["--version"]);
    return stdout.trim(); // Python 3 version information
  } catch (error) {
    return null; // Python 3 not found
  }
}
