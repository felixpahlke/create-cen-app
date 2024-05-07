import { Installer } from "./index.js";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const carbonInstaller: Installer = ({ frontendDir, packages }) => {
  addPackageDependency({
    frontendDir,
    dependencies: ["@carbon/react", "@carbon/icons-react"],
    devMode: false,
  });

  // Types should be included in carbon icons now, so types package is deprecated
  // addPackageDependency({
  //   frontendDir,
  //   dependencies: ["@types/carbon__icons-react"],
  //   devMode: true,
  // });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  // copy theme atom
  if (packages?.recoil.inUse) {
    const recoilThemeSrc = path.join(extrasDir, "src/atoms/useTheme.ts");
    const recoilThemeDest = path.join(frontendDir, "src/atoms/useTheme.ts");
    fs.copySync(recoilThemeSrc, recoilThemeDest);
  }
};
