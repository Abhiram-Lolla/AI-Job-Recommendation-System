import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

console.log("pdfParse type:", typeof pdfParse);
console.log("pdfParse keys:", Object.keys(pdfParse));
if (typeof pdfParse === 'function') {
    console.log("pdfParse is a function");
} else if (pdfParse.default) {
    console.log("pdfParse.default is present");
} else {
    console.log("pdfParse is something else:", pdfParse);
}
