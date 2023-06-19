import { TemplateDeps } from "./index.js";

type Command = {
  conditionString: string;
  position: "start" | "end";
};

type ProcessedCommand = Command & {
  mode: "keep" | "delete";
};

// extract comment from line
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

// get command from comment
export const getCommand = (line: string): Command | null => {
  const comment = extractComment(line);
  if (!comment) {
    return null;
  }
  // trim and remove double spaces
  const trimmedComment = comment.trim().replace(/ +(?= )/g, "");
  if (trimmedComment.startsWith("$start:")) {
    const conditionString = trimmedComment.substring(7).trim();
    return { conditionString, position: "start" };
  }
  if (trimmedComment.startsWith("$end:")) {
    const conditionsString = trimmedComment.substring(5).trim();
    return { conditionString: conditionsString, position: "end" };
  }
  return null;
};

// find out if content within command should be kept or deleted
export const processCommand = (
  command: Command,
  usedDependencies: TemplateDeps[],
): ProcessedCommand => {
  const { conditionString, position } = command;

  let conditions: string[] = [conditionString];

  if (conditionString.includes("&&")) {
    conditions = conditionString.split("&&");
  }
  // check if all && conditions are true
  for (let i = 0; i < conditions.length; i++) {
    const condition = conditions[i]!.trim();
    const fullfilled = checkCondition(condition, usedDependencies);
    // if one is not fullfilled return delete
    if (!fullfilled) {
      return { mode: "delete", position, conditionString };
    }
  }
  return { mode: "keep", position, conditionString };
};

const checkCondition = (condition: string, usedDependencies: TemplateDeps[]): boolean => {
  const conditions = condition.split("||");
  for (let i = 0; i < conditions.length; i++) {
    if (isSingleConditionMet(conditions[i]!, usedDependencies)) {
      return true;
    }
  }
  return false;
};

const isDependencyUsed = (dependency: TemplateDeps, usedDependencies: TemplateDeps[]): boolean => {
  return usedDependencies.includes(dependency);
};

const isSingleConditionMet = (condition: string, usedDependencies: TemplateDeps[]): boolean => {
  const negationPrefix = "!";
  const trimmedCondition = condition.trim();

  if (trimmedCondition.startsWith(negationPrefix)) {
    const dependency = trimmedCondition.substring(1).trim() as TemplateDeps;
    return !isDependencyUsed(dependency, usedDependencies);
  }
  return usedDependencies.includes(trimmedCondition as TemplateDeps);
};

export const getProcessedCommand = (
  line: string,
  usedDependencies: TemplateDeps[],
): ProcessedCommand | null => {
  const command = getCommand(line);
  if (!command) {
    return null;
  }
  const processedCommand = processCommand(command, usedDependencies);
  return processedCommand;
};
