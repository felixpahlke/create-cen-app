import fs from "fs-extra";
import prettier from "prettier";

export const formatFile = (path: string) => {
  const content = fs.readFileSync(path, "utf-8");
  const formattedContent = prettier.format(content, {
    printWidth: 100,
    tabWidth: 2,
    parser: "typescript",
  });
  fs.writeFileSync(path, formattedContent);
};
