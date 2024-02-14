import { execa } from "execa";

export type PythonVersion = {
  path: string;
  version?: string;
  owner: "system" | "user";
};

export const getUserPythonVersions = async (): Promise<PythonVersion[] | null> => {
  try {
    // get all paths for python3 & python found in $PATH
    const python3Paths = await getPythonPaths("python3");
    const pythonPaths = await getPythonPaths("python");

    const paths = [...python3Paths, ...pythonPaths];

    if (paths.length === 0) {
      return null;
    }

    // try get versions from each path
    let versions: PythonVersion[] = [];
    for (const path of paths) {
      const version = await getPythonVersion(path);
      if (version) {
        // same for linux??
        if (path.startsWith("/usr/bin")) {
          versions.push({ path, version, owner: "system" });
        } else {
          versions.push({ path, version, owner: "user" });
        }
      }
    }
    // remove duplicates
    versions = versions.filter(
      (version, index, self) => index === self.findIndex((v) => v.path === version.path),
    );

    // sort so that system versions are first
    // versions.sort((a, b) => {
    //   if (a.owner === "system" && b.owner === "user") {
    //     return -1;
    //   } else if (a.owner === "user" && b.owner === "system") {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // });

    return versions;
  } catch (error) {
    // console.log(error);
    return null; // Python 3 not found
  }
};

async function getPythonPaths(alias: string): Promise<string[]> {
  try {
    const { stdout } = await execa("type", ["-a", alias]);
    const text = stdout.trim();
    const regex = new RegExp(`(?<=${alias} is ).+`, "gm");
    const paths = text.match(regex) || [];
    return paths;
  } catch (e) {
    return [];
  }
}

async function getPythonVersion(path: string): Promise<string | null> {
  try {
    const { stdout } = await execa(path, ["--version"]);
    return stdout.trim();
  } catch (error) {
    // console.log(error);
    return null; // Python not found
  }
}
