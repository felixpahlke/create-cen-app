import { PackageRemoverOptions } from "./index.js";
import fs from "fs-extra";
import path from "path";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";

export const carbonRemover = ({ frontendDir }: PackageRemoverOptions) => {
  replaceTextInFiles(frontendDir, 'declare module "@carbon/react";', "");
  replaceTextInFiles(frontendDir, 'declare module "@carbon/react/icons";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/react/scss/themes";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/react/scss/theme";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/styles";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/themes/scss/tokens";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/react/scss/spacing";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/grid";', "");
  replaceTextInFiles(frontendDir, '@use "@carbon/type";', "");

  fs.removeSync(path.join(frontendDir, "src/atoms/useTheme.ts"));
};
