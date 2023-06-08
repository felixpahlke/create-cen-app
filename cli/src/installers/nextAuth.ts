import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { type AvailableDependencies } from "~/installers/dependencyVersionMap.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const nextAuthInstaller: Installer = ({ frontendDir, packages }) => {
  const usingPrisma = packages?.prisma.inUse;
  const deps: AvailableDependencies[] = ["next-auth"];
  if (usingPrisma) deps.push("@next-auth/prisma-adapter");

  addPackageDependency({
    frontendDir,
    dependencies: deps,
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const apiHandlerFile = "src/pages/api/auth/[...nextauth].ts";
  const apiHandlerSrc = path.join(extrasDir, apiHandlerFile);
  const apiHandlerDest = path.join(frontendDir, apiHandlerFile);

  const authConfigSrc = path.join(
    extrasDir,
    "src/server/auth",
    usingPrisma ? "with-prisma.ts" : "base.ts",
  );
  const authConfigDest = path.join(frontendDir, "src/server/auth.ts");

  fs.copySync(apiHandlerSrc, apiHandlerDest);
  fs.copySync(authConfigSrc, authConfigDest);
};
