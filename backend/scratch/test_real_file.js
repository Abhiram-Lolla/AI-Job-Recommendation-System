import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    // Pick an uploaded file that is likely a PDF
    const dataBuffer = fs.readFileSync("uploads/0a88fd5a7acaa2ff737c992d883be8c2");
    const uint8Array = new Uint8Array(dataBuffer);
    const parsePdf = pdfParse.PDFParse;

    console.log("--- Testing with real uploaded file ---");
    try {
        const instance = new parsePdf(uint8Array);
        const text = await instance.getText();
        console.log("SUCCESS! Text length:", text.length);
        console.log("Preview:", text.substring(0, 100));
    } catch (e) {
        console.log("FAILED:", e.message);
    }
}

test();
