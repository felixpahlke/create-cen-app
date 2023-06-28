import { processTemplate } from "./index.js";

processTemplate({
  templatePath: "",
  resultPath: "src/templateProcessor/result_index.tsx",
  usedDependencies: ["tailwind", "recoil"],
});
