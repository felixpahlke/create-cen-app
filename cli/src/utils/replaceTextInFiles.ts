import { escapeRegexChars } from "./escapeRegexChars.js";
import fs from "fs";
import path from "path";

function replaceTextInFiles(directoryPath: string, search: string, replacement: string): void {
  if (fs.statSync(directoryPath).isDirectory()) {
    const files = fs.readdirSync(directoryPath);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        replaceTextInFiles(filePath, search, replacement);
      } else {
        const data = fs.readFileSync(filePath, "utf8");
        const updatedData = data.replace(new RegExp(escapeRegexChars(search), "g"), replacement);
        fs.writeFileSync(filePath, updatedData, "utf8");
      }
    });
  } else {
    //Case that path is a file
    const data = fs.readFileSync(directoryPath, "utf8");
    const updatedData = data.replace(new RegExp(escapeRegexChars(search), "g"), replacement);
    fs.writeFileSync(directoryPath, updatedData, "utf8");
  }
}

export default replaceTextInFiles;
