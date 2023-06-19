import fs from "fs-extra";
import path from "path";
import { PkgInstallerMap } from "~/installers/index.js";
import { carbonRemover } from "~/removers/carbon.js";
import { recoilRemover } from "~/removers/recoil.js";
import { formatFile } from "~/utils/formatFile.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";
import replaceTextInFilesBetween from "~/utils/replaceTextInFilesBetween.js";

interface RemovePackagesProps {
  projectDir: string;
  frontendDir: string;
  packages: PkgInstallerMap;
}

export const removePackages = ({ packages, projectDir, frontendDir }: RemovePackagesProps) => {
  // remove tailwind css import if not using tailwind
  if (!packages.recoil.inUse) {
    recoilRemover({ frontendDir });
  }
  if (!packages.carbon.inUse) {
    carbonRemover({ frontendDir });
  }
  if (!packages.tailwind.inUse) {
    replaceTextInFiles(frontendDir, 'import "~/styles/tailwind.css";', "");
  }

  if (packages.carbon.inUse) {
    // Remove the recoil counter demo since we have the Theme with carbon
    replaceTextInFiles(frontendDir, `import useCounter from "~/atoms/useCounter";`, "");
    replaceTextInFiles(frontendDir, `const [counter] = useCounter();`, "");
    replaceTextInFiles(frontendDir, `<p className="mt-6">counter: {counter}</p>`, "");
    replaceTextInFiles(frontendDir, `<p>counter: {counter}</p>`, "");

    // remove useCounter from Header.tsx
    replaceTextInFiles(frontendDir, `const [counter, setCounter] = useCounter();`, "");
    replaceTextInFiles(frontendDir, `const [counter] = useCounter();`, "");
    replaceTextInFiles(frontendDir, `setCounter(counter + 1);`, "");
    replaceTextInFilesBetween(
      path.join(frontendDir, "src/components/layout"),
      `<button`,
      `button>`,
      "",
    );
    // remove useCounter.ts
    fs.removeSync(path.join(frontendDir, "src/atoms/useCounter.ts"));
  }

  //TEST: remove recoil if not using recoil
  if (packages.carbon.inUse) {
    replaceTextInFiles(frontendDir, "@tailwind base;", "");
  }

  if (packages.carbon.inUse || packages.tailwind.inUse) {
    // remove default stylings
    replaceTextInFilesBetween(frontendDir, `body {`, `}`, "");
  }

  // format files
  formatFile(path.join(frontendDir, "src/pages/index.tsx"), "typescript");
  formatFile(path.join(frontendDir, "src/components/layout/Layout.tsx"), "typescript");
  formatFile(path.join(frontendDir, "src/components/layout/Header.tsx"), "typescript");
  formatFile(path.join(frontendDir, "src/pages/_app.tsx"), "typescript");
  formatFile(path.join(frontendDir, "src/styles/globals.scss"), "scss");
};
