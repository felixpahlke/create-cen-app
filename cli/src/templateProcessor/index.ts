type AvailableDependencies = "tailwind" | "carbon" | "recoil" | "extbackend";

interface ProcessTemplateProps {
  templatePath: string;
  templateDependencies: AvailableDependencies[];
}

export const processTemplate = ({ templatePath, templateDependencies }: ProcessTemplateProps) => {};

const lineIsInsideComment = (line: string) => {
  const trimmedLine = line.trim();

  // Check for single-line comments (//)
  if (trimmedLine.startsWith("//")) {
    return true;
  }

  // Check for jsx/tsx comments ({/* */})
  if (trimmedLine.startsWith("{/*") && !trimmedLine.endsWith("*/}")) {
    return true;
  }

  // Check for multi-line comments (/* */)
  if (!trimmedLine.startsWith("/*") && trimmedLine.endsWith("*/")) {
    return true;
  }

  // Check for multi-line comments (/* */)
  if (trimmedLine.includes("/*") && trimmedLine.includes("*/")) {
    return true;
  }

  return false;
};
