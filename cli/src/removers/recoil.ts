import { type PackageRemoverOptions } from "./index.js";
import fs from "fs-extra";
import path from "path";
import { formatFile } from "~/utils/formatFile.js";
import replaceTextInFiles from "~/utils/replaceTextInFiles.js";
import replaceTextInFilesBetween from "~/utils/replaceTextInFilesBetween.js";

export const recoilRemover = ({ frontendDir }: PackageRemoverOptions) => {
  replaceTextInFiles(frontendDir, 'import { RecoilRoot } from "recoil";', "");
  replaceTextInFiles(frontendDir, "<RecoilRoot>", "");
  replaceTextInFiles(frontendDir, "</RecoilRoot>", "");

  // remove atoms folder
  fs.removeSync(path.join(frontendDir, "src/atoms"));
  // remove Theme import in Layout and Header
  replaceTextInFiles(frontendDir, 'import useTheme from "~/atoms/useTheme";', "");
  // remove useTheme
  replaceTextInFiles(frontendDir, `const [theme, setTheme] = useTheme();`, "");
  replaceTextInFiles(frontendDir, `const [theme] = useTheme();`, "");
  // Replace Thee component with empty tags
  replaceTextInFiles(frontendDir, `<Theme theme={theme}>`, '<Theme theme="white">');
  // replaceTextInFiles(frontendDir, `</Theme>`, "</>");
  // replaceTextInFiles(frontendDir, `import { Theme } from "@carbon/react";`, "");
  // remove ThemeSwitcher from Header
  replaceTextInFilesBetween(frontendDir, `<HeaderGlobalBar>`, `</HeaderGlobalBar>`, "");
  // remove more Imports
  replaceTextInFiles(frontendDir, 'import { BrightnessContrast } from "@carbon/icons-react";', "");
  replaceTextInFiles(frontendDir, "HeaderGlobalAction,", "");
  replaceTextInFiles(frontendDir, "HeaderGlobalBar,", "");

  // format files
  formatFile(path.join(frontendDir, "src/components/layout/Layout.tsx"));
  formatFile(path.join(frontendDir, "src/components/layout/Header.tsx"));
  formatFile(path.join(frontendDir, "src/pages/_app.tsx"));
};
