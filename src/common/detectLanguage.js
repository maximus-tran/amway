import { detectAll } from "tinyld";

const isLanguageMatching = (text, validLanguages) => {
  const detectedLanguages = detectAll(text).map(x => x.lang);
  return validLanguages.some(lang => detectedLanguages.includes(lang));
};

export { isLanguageMatching }