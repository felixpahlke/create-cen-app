export const escapeRegexChars = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
};
