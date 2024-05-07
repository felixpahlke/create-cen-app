import { execa } from "execa";

export type PythonVersion = {
  path: string;
  version?: string;
  owner: "system" | "user";
};

export const getUserPythonVersions = async (): Promise<PythonVersion[] | null> => {
  try {
    // get all python aliases
    const aliases = await getPythonAliases();

    const paths: string[] = [];
    for (const alias of aliases) {
      const _paths = await getPythonPaths(alias);
      paths.push(..._paths);
    }

    if (paths.length === 0) {
      return null;
    }

    // try get versions from each path
    let versions: PythonVersion[] = [];
    for (const path of paths) {
      const version = await getPythonVersion(path);
      if (version) {
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

    // sort by version
    versions = versions.sort((a, b) => {
      if (a.version && b.version) {
        return compareVersions(a.version, b.version);
      } else {
        return 0;
      }
    });

    return versions;
  } catch (error) {
    // console.log(error);
    return null; // Python 3 not found
  }
};
async function getPythonAliases(): Promise<string[]> {
  try {
    const { stdout } = await execa("compgen", ["-c", "|", "grep", "-E", "'^python[0-9.]*$'"], {
      shell: true,
    });
    const text = stdout.trim();
    const aliases = text.split("\n");
    return aliases;
  } catch (e) {
    return [];
  }
}

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

function compareVersions(versionA: string, versionB: string): number {
  const partsA = versionA.split(".").map(Number);
  const partsB = versionB.split(".").map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const partA = partsA[i] || 0;
    const partB = partsB[i] || 0;

    if (partA < partB) {
      return 1;
    } else if (partA > partB) {
      return -1;
    }
  }

  return 0;
}
