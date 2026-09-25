import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("dummy.pdf");
    let parsePdf = pdfParse;
    if (typeof pdfParse !== 'function' && pdfParse.PDFParse) parsePdf = pdfParse.PDFParse;
    
    console.log("Using parsePdf:", parsePdf.name || typeof parsePdf);
    
    try {
        const instance = new parsePdf();
        console.log("Instance created");
        const data = await instance.parse(dataBuffer);
        console.log("Data parsed. Keys:", Object.keys(data));
        console.log("Text content preview:", data.text ? data.text.substring(0, 50) : "No text property");
    } catch (e) {
        console.error("Error during test:", e);
    }
}

test();
