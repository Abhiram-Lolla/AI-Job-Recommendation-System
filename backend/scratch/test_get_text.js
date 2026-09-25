import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("dummy.pdf");
    const parsePdf = pdfParse.PDFParse;
    const instance = new parsePdf({ verbosity: 0 });
    await instance.load(dataBuffer);
    const text = await instance.getText();
    console.log("Text type:", typeof text);
    console.log("Text content:", text);
}

test();
