import { escapeRegexChars } from "./escapeRegexChars.js";
import fs from "fs";
import path from "path";

function replaceTextInFilesBetween(
  directoryPath: string,
  searchStart: string,
  searchEnd: string,
  replacement: string,
): void {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceTextInFilesBetween(filePath, searchStart, searchEnd, replacement);
    } else {
      const data = fs.readFileSync(filePath, "utf8");
      const updatedData = data.replace(
        new RegExp(`${escapeRegexChars(searchStart)}[\\s\\S]*${escapeRegexChars(searchEnd)}`, "g"),
        replacement,
      );

      //   const updatedData = data.replace(new RegExp(search, "g"), replacement);
      fs.writeFileSync(filePath, updatedData, "utf8");
    }
  });
}

export default replaceTextInFilesBetween;
