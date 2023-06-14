import { Installer } from "./index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const recoilInstaller: Installer = ({ frontendDir, packages }) => {
  addPackageDependency({
    frontendDir,
    dependencies: ["recoil"],
    devMode: false,
  });
};
