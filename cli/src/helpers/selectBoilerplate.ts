import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { type PkgInstallerMap, type AvailableBackends } from "~/installers/index.js";

// type SelectBoilerplateProps = Required<Pick<InstallerOptions, "frontendDir" | "packages">>;
type SelectBoilerplateProps = {
  frontendDir: string;
  packages: PkgInstallerMap;
  backend: AvailableBackends;
};
// This generates the _app.tsx file that is used to render the app
export const selectAppFile = ({ frontendDir, packages, backend }: SelectBoilerplateProps) => {
  const appFileDir = path.join(PKG_ROOT, "template/extras/src/pages/_app");

  const usingTRPC = packages.trpc.inUse;
  const usingExternalBackend = backend !== "default" && backend !== "trpc";
  // const usingNextAuth = packages.nextAuth.inUse;

  let appFile = "";
  if (usingTRPC) {
    appFile = "with-trpc.tsx";
  } else if (usingExternalBackend) {
    appFile = "with-ext-backend.tsx";
  }

  if (appFile !== "") {
    const appSrc = path.join(appFileDir, appFile);
    const appDest = path.join(frontendDir, "src/pages/_app.tsx");
    fs.copySync(appSrc, appDest);
  }
};

// This selects the proper index.tsx to be used that showcases the chosen tech
export const selectIndexFile = ({ frontendDir, packages, backend }: SelectBoilerplateProps) => {
  const indexFileDir = path.join(PKG_ROOT, "template/extras/src/pages/index");

  const usingTRPC = packages.trpc.inUse;
  const usingTw = packages.tailwind.inUse;
  // const usingAuth = packages.nextAuth.inUse; // NOTE: Maybe add this later
  const usingExternalBackend = backend !== "default" && backend !== "trpc";

  let indexFile = "";
  if (usingTRPC && usingTw) {
    indexFile = "with-trpc-tw.tsx";
  } else if (usingTRPC && !usingTw) {
    indexFile = "with-trpc.tsx";
  } else if (!usingTRPC && usingTw && !usingExternalBackend) {
    indexFile = "with-tw.tsx";
  } else if (usingExternalBackend && usingTw) {
    indexFile = "with-ext-backend-tw.tsx";
  } else if (usingExternalBackend && !usingTw) {
    indexFile = "with-ext-backend.tsx";
  }

  if (indexFile !== "") {
    const indexSrc = path.join(indexFileDir, indexFile);
    const indexDest = path.join(frontendDir, "src/pages/index.tsx");
    fs.copySync(indexSrc, indexDest);
  }
};
