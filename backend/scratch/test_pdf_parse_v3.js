import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("dummy.pdf");
    let parsePdf = pdfParse;
    if (typeof pdfParse !== 'function' && pdfParse.PDFParse) parsePdf = pdfParse.PDFParse;
    
    try {
        console.log("Trying new parsePdf({})");
        const instance = new parsePdf({}); 
        const data = await instance.parse(dataBuffer);
        console.log("Success! Text:", data.text);
    } catch (e) {
        console.log("Failed with {}, trying another way...");
        try {
            // Some libraries have a static parse method
            if (pdfParse.PDFParse && pdfParse.PDFParse.parse) {
                const data = await pdfParse.PDFParse.parse(dataBuffer);
                console.log("Success with static parse! Text:", data.text);
            } else {
                 console.error("No static parse found. Error was:", e);
            }
        } catch (e2) {
            console.error("Final failure:", e2);
        }
    }
}

test();
