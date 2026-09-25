import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

async function test() {
    const dataBuffer = fs.readFileSync("dummy.pdf");
    const uint8Array = new Uint8Array(dataBuffer);
    const parsePdf = pdfParse.PDFParse;

    console.log("--- Variation 4: instance.load(uint8Array) ---");
    try {
        const instance = new parsePdf({ verbosity: 0 });
        await instance.load(uint8Array);
        const text = await instance.getText();
        console.log("Success 4! Text:", text);
    } catch (e) {
        console.log("Fail 4:", e.message);
    }

    console.log("--- Variation 5: new parsePdf(uint8Array) ---");
    try {
        const instance = new parsePdf(uint8Array);
        // Maybe it auto-loads?
        const text = await instance.getText();
        console.log("Success 5! Text:", text);
    } catch (e) {
        console.log("Fail 5:", e.message);
    }
}

test();
