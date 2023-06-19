import { TemplateDeps } from "./index.js";

type TemplateCommand = {
  dependency: TemplateDeps;
  mode: "keep" | "delete";
  position: "start" | "end";
};

export const getTemplateCommand = (
  line: string,
  usedDependencies: TemplateDeps[],
): TemplateCommand | null => {
  const comment = extractComment(line);

  if (!comment) {
    return null;
  }
  const trimmedComment = comment.trim();

  if (trimmedComment.startsWith("using")) {
    const command = trimmedComment.substring(5).toLowerCase().trim();

    // check if command is inside usedDependencies
    if (usedDependencies.includes(command as TemplateDeps)) {
      return { dependency: command as TemplateDeps, mode: "keep", position: "start" };
    } else {
      return { dependency: command as TemplateDeps, mode: "delete", position: "start" };
    }
  }
  if (trimmedComment.startsWith("endUsing")) {
    const command = trimmedComment.substring(8).toLowerCase().trim();

    // check if command is inside usedDependencies
    if ((usedDependencies as string[]).includes(command)) {
      return { dependency: command as TemplateDeps, mode: "keep", position: "end" };
    } else {
      return { dependency: command as TemplateDeps, mode: "delete", position: "end" };
    }
  }
  if (trimmedComment.startsWith("notUsing")) {
    const command = trimmedComment.substring(8).toLowerCase().trim();

    // check if command is inside usedDependencies
    if ((usedDependencies as string[]).includes(command)) {
      return { dependency: command as TemplateDeps, mode: "delete", position: "start" };
    } else {
      return { dependency: command as TemplateDeps, mode: "keep", position: "start" };
    }
  }
  if (trimmedComment.startsWith("endNotUsing")) {
    const command = trimmedComment.substring(11).toLowerCase().trim();

    // check if command is inside usedDependencies
    if ((usedDependencies as string[]).includes(command)) {
      return { dependency: command as TemplateDeps, mode: "delete", position: "end" };
    } else {
      return { dependency: command as TemplateDeps, mode: "keep", position: "end" };
    }
  }

  return null;
};

function extractComment(line: string) {
  const trimmedLine = line.trim();

  // Single-line comment (//)
  if (trimmedLine.startsWith("//")) {
    return trimmedLine.substring(2).trim();
  }

  // jsx/tsx comment ({/* */})
  if (trimmedLine.startsWith("{/*") && trimmedLine.endsWith("*/}")) {
    return trimmedLine.substring(3, trimmedLine.length - 3).trim();
  }

  // Multi-line comment (/* */)
  if (trimmedLine.startsWith("/*") && trimmedLine.endsWith("*/")) {
    return trimmedLine.substring(2, trimmedLine.length - 2).trim();
  }

  // return "" if no comment was found
  return "";
}
