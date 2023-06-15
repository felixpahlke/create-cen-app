import { type PackageRemoverOptions } from "./index.js";
import fs from "fs-extra";
import path from "path";
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
  // remove useCounter from index.tsx
  replaceTextInFiles(frontendDir, `import useCounter from "~/atoms/useCounter";`, "");
  replaceTextInFiles(frontendDir, `const [counter] = useCounter();`, "");
  replaceTextInFiles(frontendDir, `<p className="mt-6">counter: {counter}</p>`, "");
  replaceTextInFiles(frontendDir, `<p>counter: {counter}</p>`, "");
  replaceTextInFilesBetween(frontendDir, `.counterButton {`, `}`, "");

  // remove useCounter from Header.tsx
  replaceTextInFiles(frontendDir, `const [counter, setCounter] = useCounter();`, "");
  replaceTextInFiles(frontendDir, `const [counter] = useCounter();`, "");
  replaceTextInFiles(frontendDir, `setCounter(counter + 1);`, "");
  replaceTextInFilesBetween(
    path.join(frontendDir, "src/components/layout"),
    `<button`,
    `button>`,
    "",
  );
};
