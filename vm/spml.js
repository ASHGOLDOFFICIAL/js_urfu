const fs = require("fs");
const { argv } = require("process");
const { Interpreter } = require("./interpreter");


const preprocess = (src) => {
    const labels = {};
    let skipped = 0;

    const cleanedSrc = src
        .replace('\t', "")
        .split(/[\n ]/)
        .filter( (el, index) => {
            if (el.charAt(0) === ':') {
                labels[el.slice(1)] = index - skipped;
            }
            if (el === "") {
                ++skipped;
            }
            return (el !== "")
        });

    for (let i = 0; i < cleanedSrc.length; ++i) {
        const el = cleanedSrc[i];
        if (el.charAt(0) === "#") {
            cleanedSrc[i] = labels[el.slice(1)];
        } else if (el.charAt(0) === ":") {
            cleanedSrc[i] = "pass";
        }
    }

    return cleanedSrc;
}


const readToMemory = (mem, file) => {
    const src = fs.readFileSync(file, { encoding: "utf-8" });
    const cleaned = preprocess(src);
    for (let i = 0; i < cleaned.length; ++i) {
        mem[i] = cleaned[i];
    }
}


const main = (srcFile="input.spml") => {
    const mem = new Array(200);
    const interpreter = new Interpreter(mem);
    readToMemory(mem, srcFile);
    //console.log(mem);
    interpreter.run();
}


main(argv[2]);

