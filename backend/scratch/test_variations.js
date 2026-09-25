import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("dummy.pdf");
    const parsePdf = pdfParse.PDFParse;

    console.log("--- Variation 1: instance.load({ data: buffer }) ---");
    try {
        const instance = new parsePdf({ verbosity: 0 });
        await instance.load({ data: dataBuffer });
        const text = await instance.getText();
        console.log("Success 1! Text length:", text.length);
    } catch (e) {
        console.log("Fail 1:", e.message);
    }

    console.log("--- Variation 2: Passing buffer to constructor ---");
    try {
        const instance = new parsePdf(dataBuffer);
        await instance.load(); // or maybe it's already loaded?
        const text = await instance.getText();
        console.log("Success 2! Text length:", text.length);
    } catch (e) {
        console.log("Fail 2:", e.message);
    }
    
    console.log("--- Variation 3: Using the classic-like export (if it exists) ---");
    try {
        // Check if the default export or the required object itself works as a function
        const classicResult = await pdfParse(dataBuffer);
        console.log("Success 3! Text length:", classicResult.text.length);
    } catch (e) {
        console.log("Fail 3:", e.message);
    }
}

test();
