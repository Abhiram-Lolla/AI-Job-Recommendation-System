import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("uploads/0a88fd5a7acaa2ff737c992d883be8c2");
    const uint8Array = new Uint8Array(dataBuffer);
    const parsePdf = pdfParse.PDFParse;

    try {
        const instance = new parsePdf(uint8Array);
        const result = await instance.getText();
        console.log("Result type:", typeof result);
        console.log("Result constructor:", result?.constructor?.name);
        if (typeof result === 'object') {
            console.log("Result keys:", Object.keys(result));
            // Maybe it's a generator or has a specific property?
        }
        console.log("Raw result:", result);
    } catch (e) {
        console.log("Error:", e);
    }
}

test();
