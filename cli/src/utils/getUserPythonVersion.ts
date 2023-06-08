import { execa } from "execa";

export type PythonInfo = {
  installed: boolean;
  alias?: "/usr/bin/python" | "/usr/bin/python3";
  version?: string;
};

// TODO: check for more python versions / locations

export const getUserPythonInfo = async (): Promise<PythonInfo> => {
  const pythonVersion = await checkPythonVersion();
  const python3Version = await checkPython3Version();

  // just python or python3 does not work here --> same behaviour as a bash shell
  if (pythonVersion) {
    return { installed: true, alias: "/usr/bin/python", version: pythonVersion };
  } else if (python3Version) {
    return { installed: true, alias: "/usr/bin/python3", version: python3Version };
  } else {
    return { installed: false };
  }
};

async function checkPythonVersion(): Promise<string | null> {
  try {
    const { stdout } = await execa("/usr/bin/python", ["--version"]);
    return stdout.trim(); // Python version information
  } catch (error) {
    // console.log(error);
    return null; // Python not found
  }
}

async function checkPython3Version(): Promise<string | null> {
  try {
    const { stdout } = await execa("/usr/bin/python3", ["--version"]);
    return stdout.trim(); // Python 3 version information
  } catch (error) {
    console.log(error);
    return null; // Python 3 not found
  }
}
