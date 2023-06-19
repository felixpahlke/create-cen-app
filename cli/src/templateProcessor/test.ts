import { processTemplate } from "./index.js";

processTemplate({
  templatePath:
    "/Users/felixpahlke/coding/assets/create-cen-app/cli/template/base/src/pages/_app.tmpl.tsx",
  resultPath: "src/templateProcessor/result.tsx",
  usedDependencies: ["extbackend", "tailwind", "trpc", "recoil"],
});
