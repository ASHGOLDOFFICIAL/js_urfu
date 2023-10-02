let fs = require("fs")


function main(command, fileName1, fileName2) {
    //console.log(command, inputFileName, outputFileName)
    
    if (!command || !fileName1 || !fileName2) {
        console.error("Not enough arguments!")
        return
    }

    // Check if given command exists and select the function if it does
    let commandFunc
    switch (command) {
        case "check":
            commandFunc = check
            break
        case "code":
            commandFunc = encode
            break
        case "decode":
            commandFunc = decode
            break
        default:
            console.error("Unknown command: " + command)
            return
    }

    // Attempt to read input file
    let inText
    try {
        inText = fs.readFileSync(fileName1, {encoding: "utf-8"})
    } catch (err) {
        console.error(`Read error: ${err}`)
        return
    }

    //console.log(inText, inText.slice(-1))
    
    
    // Attempt to write to output file if needed
    const { outText, message } = commandFunc(inText)
    try {
        fs.writeFileSync(fileName2, outText)
    } catch (err) {
        console.error(`Write error: ${err}`)
        return
    }

    console.log(message)
}


function encodeSequence(char, count) {
    let out = ""

    if ((count > 3) || (char === '#')) {
        out += ("#" + String.fromCharCode(255) + char)
            .repeat(Math.floor(count / 255))
        out += "#" + String.fromCharCode(count % 255) + char
    } else {
        out += char.repeat(count)
    }
        
    return out
}


function encode(input) {
    let lastChar = input[0]
    let count = 0
    let out = ""
    
    for (let i = 0; i < input.length; i++) {
        if (lastChar === input[i]) {
            count++
        } else {
            out += encodeSequence(lastChar, count)
            lastChar = input[i]
            count = 1
        }

        if (i === input.length - 1) {
            out += encodeSequence(lastChar, count)
        }
    }
    const message = "File's compressed." +
        `\nCompression ratio: ${input.length / out.length}`

    return { outText: out, message }
}


function decode(input) {
    let out = ""

    for (let i = 0; i < input.length; i++) {
        //console.log(...text.slice(i, i+3))
        
        if (input[i] === "#") {
            out += input[i+2].repeat(input[i+1].charCodeAt(0))
            i += 2 // skip next two characters
            continue
        }
        out += input[i]
    }
    
    const message = "File's decompressed."
    return { outText: out, message }
}


// Doesn't work, because when reading
// from file additional newline char appears.
function check(text) {
    const encodedText = encode(text).outText
    // Newline character's added to imitate file in system
    const decodedText = decode(encodedText).outText
    const out = `Original: ${text}` +
        `\nDecoded: ${decodedText}` +
        `\n\nResult: ${(text === decodedText) ? "Sussess" : "Fail"}`
    return { outText: out, message: out }
}


main(...process.argv.slice(2, 5))

