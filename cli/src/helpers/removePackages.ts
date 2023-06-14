import { PkgInstallerMap } from "~/installers/index.js";
import { carbonRemover } from "~/removers/carbon.js";
import { recoilRemover } from "~/removers/recoil.js";
import { logger } from "~/utils/logger.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";

interface RemovePackagesProps {
  projectDir: string;
  frontendDir: string;
  packages: PkgInstallerMap;
}

export const removePackages = ({ packages, projectDir, frontendDir }: RemovePackagesProps) => {
  // remove tailwind css import if not using tailwind
  if (!packages.tailwind.inUse) {
    replaceTextInFiles(frontendDir, 'import "~/styles/tailwind.css";', "");
  }

  //TEST: remove recoil if not using recoil
  if (!packages.recoil.inUse) {
    recoilRemover({ frontendDir });
  }
  if (!packages.carbon.inUse) {
    carbonRemover({ frontendDir });
  }
  if (packages.carbon.inUse) {
    replaceTextInFiles(frontendDir, "@tailwind base;", "");
  }
};
