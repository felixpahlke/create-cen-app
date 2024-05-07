import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";

export const tailwindInstaller: Installer = ({ frontendDir, packages }) => {
  addPackageDependency({
    frontendDir,
    dependencies: [
      "tailwindcss",
      "postcss",
      "autoprefixer",
      "prettier",
      "prettier-plugin-tailwindcss",
      // "@types/prettier",
    ],
    devMode: true,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const twCfgDest = path.join(frontendDir, "tailwind.config.ts");
  let twCfgSrc = path.join(extrasDir, "config/tailwind.config.ts");
  if (packages?.carbon.inUse) {
    twCfgSrc = path.join(extrasDir, "config/with-tw-carbon/tailwind.config.ts");
  }

  const postcssCfgSrc = path.join(extrasDir, "config/postcss.config.cjs");
  const postcssCfgDest = path.join(frontendDir, "postcss.config.cjs");

  const prettierSrc = path.join(extrasDir, "config/prettier.config.cjs");
  const prettierDest = path.join(frontendDir, "prettier.config.cjs");

  const cssSrc = path.join(extrasDir, "src/styles/tailwind.css");
  const cssDest = path.join(frontendDir, "src/styles/tailwind.css");

  fs.copySync(twCfgSrc, twCfgDest);
  fs.copySync(postcssCfgSrc, postcssCfgDest);
  fs.copySync(cssSrc, cssDest);
  fs.copySync(prettierSrc, prettierDest);

  // Remove vanilla css file
  const indexModuleCss = path.join(frontendDir, "src/pages/index.module.css");
  fs.unlinkSync(indexModuleCss);
  // Remove vanilla css file from components
  const componentsCssModuleDir = path.join(frontendDir, "src/components/layout/Layout.module.css");
  fs.unlinkSync(componentsCssModuleDir);
};
