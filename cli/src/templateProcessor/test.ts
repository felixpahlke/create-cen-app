import { processTemplate } from "./index.js";

processTemplate({
  templatePath:
    "/Users/felixpahlke/coding/assets/create-cen-app/cli/template/base/src/pages/index.tmpl.tsx",
  resultPath: "src/templateProcessor/result_index.tsx",
  usedDependencies: ["tailwind", "recoil"],
});
