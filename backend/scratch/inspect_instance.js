import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const parsePdf = pdfParse.PDFParse;
const instance = new parsePdf({});
console.log("Instance keys:", Object.getOwnPropertyNames(instance));
console.log("Prototype keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
