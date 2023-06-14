import { Installer } from "./index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const carbonInstaller: Installer = ({ frontendDir, packages }) => {
  addPackageDependency({
    frontendDir,
    dependencies: ["@carbon/react", "@carbon/icons-react"],
    devMode: false,
  });
  addPackageDependency({
    frontendDir,
    dependencies: ["@types/carbon__icons-react"],
    devMode: true,
  });
};
