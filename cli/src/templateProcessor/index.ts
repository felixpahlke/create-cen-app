import { formatFile } from "../utils/formatFile.js";
import { getTemplateCommand } from "./getTemplateCommand.js";
import fs from "fs-extra";

export const templateDeps = ["tailwind", "trpc", "extbackend", "recoil"] as const;

export type TemplateDeps = (typeof templateDeps)[number];

interface ProcessTemplateProps {
  templatePath: string;
  resultPath: string;
  usedDependencies: TemplateDeps[];
}

export const processTemplate = ({
  templatePath,
  resultPath,
  usedDependencies,
}: ProcessTemplateProps) => {
  const fileContents = fs.readFileSync(templatePath, "utf-8");
  const lines = fileContents.split("\n");
  const processedLines: string[] = [];
  let deleteMode = false;
  let currentCommand: TemplateDeps | null = null;

  // find out which lines should be kept:
  for (let line of lines) {
    const templateCommand = getTemplateCommand(line, usedDependencies);
    if (templateCommand) {
      if (templateCommand.mode === "delete" && templateCommand.position === "start") {
        deleteMode = true;
        currentCommand = templateCommand.dependency;
      }
      if (
        // if we are in delete mode and the current command is the one that ends the delete mode (supports nested commands)
        templateCommand.mode === "delete" &&
        templateCommand.position === "end" &&
        currentCommand === templateCommand.dependency
      ) {
        deleteMode = false;
      }
    }
    if (!deleteMode && !templateCommand) {
      processedLines.push(line);
    }
  }

  // write the processed lines to result file
  fs.writeFileSync(resultPath, processedLines.join("\n"));

  // format the result file
  formatFile(resultPath, "typescript");
};
