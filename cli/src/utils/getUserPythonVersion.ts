import { execa } from "execa";

export type PythonVersion = {
  path: string;
  version?: string;
  owner: "system" | "user";
};

// TODO: check for more python versions / locations

// export const getUserPythonInfo = async (): Promise<PythonInfo> => {
//   const python3Versions = await getPythonVersions();
//   // const pythonVersion = await checkPythonVersion();

//   // just python or python3 does not work here --> same behaviour as a bash shell
//   if (pythonVersion) {
//     return { installed: true, alias: "/usr/bin/python", version: "" };
//   } else if (python3Versions) {
//     return { installed: true, alias: "/usr/bin/python3", version: "" };
//   } else {
//     return { installed: false };
//   }
// };

export const getUserPythonVersions = async (): Promise<PythonVersion[] | null> => {
  try {
    // const { stdout } = await execa("/usr/bin/python3", ["--version"]);

    // get all paths for python3 found in $PATH
    // TODO: do this for "python" as well
    const { stdout } = await execa("type", ["-a", "python3"]);
    const text = stdout.trim();
    const regex = /(?<=python3 is ).+/gm;
    const paths = text.match(regex) || [];

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
    versions.sort((a, b) => {
      if (a.owner === "system" && b.owner === "user") {
        return -1;
      } else if (a.owner === "user" && b.owner === "system") {
        return 1;
      } else {
        return 0;
      }
    });

    // console.log(versions);
    return versions;
  } catch (error) {
    console.log(error);
    return null; // Python 3 not found
  }
};

async function getPythonVersion(path: string): Promise<string | null> {
  try {
    const { stdout } = await execa(path, ["--version"]);
    return stdout.trim();
  } catch (error) {
    console.log(error);
    return null; // Python not found
  }
}
