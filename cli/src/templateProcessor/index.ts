import { formatFile } from "../utils/formatFile.js";
import { getProcessedCommand } from "./processCommands.js";
import fs from "fs-extra";

export const templateDeps = ["tailwind", "trpc", "extBackend", "recoil", "carbon"] as const;

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
  let activeDeleteCommand: string | null = null;

  // find out which lines should be kept:
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    const templateCommand = getProcessedCommand(line, usedDependencies);

    if (templateCommand) {
      // checks if we have a different delete command active and if so, skip the current command
      if (templateCommand.position === "start" && activeDeleteCommand) {
        continue;
      }

      // set activeDeleteCommand
      if (templateCommand.mode === "delete" && templateCommand.position === "start") {
        deleteMode = true;
        activeDeleteCommand = templateCommand.conditionString;
      }
      // if we are in delete mode and the current command is the one that ends the delete mode (supports nested commands)
      if (
        templateCommand.mode === "delete" &&
        templateCommand.position === "end" &&
        activeDeleteCommand === templateCommand.conditionString
      ) {
        deleteMode = false;
        activeDeleteCommand = null;
      }
    }
    if (!deleteMode && !templateCommand) {
      processedLines.push(line);
    }
  }

  // TODO: optimize this to not save the file twice
  // write the processed lines to result file
  fs.writeFileSync(resultPath, processedLines.join("\n"));
  // format the result file
  formatFile(resultPath, "typescript");
};
