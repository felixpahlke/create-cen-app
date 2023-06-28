import { Installer } from "./index.js";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const recoilInstaller: Installer = ({ frontendDir, packages }) => {
  addPackageDependency({
    frontendDir,
    dependencies: ["recoil"],
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  if (!packages?.carbon.inUse) {
    const recoilSrc = path.join(extrasDir, "src/atoms/useCounter.ts");
    const recoilDest = path.join(frontendDir, "src/atoms/useCounter.ts");
    fs.copySync(recoilSrc, recoilDest);
  }
};
