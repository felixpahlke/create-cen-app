import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

interface ProxyInstallerProps {
  frontendDir: string;
}

export const proxyInstaller = ({ frontendDir }: ProxyInstallerProps) => {
  addPackageDependency({
    frontendDir,
    dependencies: ["http-proxy"],
    devMode: false,
  });
  addPackageDependency({
    frontendDir,
    dependencies: ["@types/http-proxy"],
    devMode: true,
  });

  const apiSrc = path.join(PKG_ROOT, "template/extras/src/pages/api/proxy");
  const apiDest = path.join(frontendDir, "src/pages/api");

  fs.copySync(apiSrc, apiDest);
};
