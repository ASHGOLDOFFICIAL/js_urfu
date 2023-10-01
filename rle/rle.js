let fs = require("fs")


function main(command, inputFileName, outputFileName) {
    //console.log(command, inputFileName, outputFileName)
    
    if (!command || !inputFileName || !outputFileName) {
        console.error("Not enough arguments!")
        return
    }

    // Check if given command exists and select the function if it does
    let commandFunc
    switch (command) {
        //case "check":
        //    commandFunc = check
        //    break
        case "code":
            commandFunc = code
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
        inText = fs.readFileSync(inputFileName, {encoding: "utf-8"})
    } catch (err) {
        console.error("Read error!")
        return
    }
    
    //console.log(inText, inText.slice(-1))

    // Attempt to write to output file if needed
    let outText = commandFunc(inText)
    try {
        fs.writeFileSync(outputFileName, outText)
    } catch (err) {
        console.error("Write error!")
        return
    }
}


function codeSequence(char, count) {
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


function code(text) {
    let lastChar = text[0]
    let count = 0
    let out = ""
    
    for (let i = 0; i < text.length; i++) {
        if (lastChar === text[i]) {
            count++
            if (i === text.length - 1) {
                out += codeSequence(lastChar, count)
            }
        } else {
            out += codeSequence(lastChar, count)
            lastChar = text[i]
            count = 1
        }
    }
    
    return out
}


function decode(text) {
    let out = ""

    for (let i = 0; i < text.length; i++) {
        //console.log(...text.slice(i, i+3))
        
        if (text[i] === "#") {
            out += text[i+2].repeat(text[i+1].charCodeAt(0))
            i += 2 // skip next two characters
            continue
        }
        out += text[i]
    }

    return out
}


// Doesn't work, because when reading
// from file additional newline char appears.
function check(text) {
    let encodedText = code(text)
    let decodedText = decode(encodedText)
    return `Original: ${text}\n` +
        `Decoded: ${decodedText}\n\n` +
        `Result: ${(text === decodedText) ? "Sussess" : "Fail"}`
}


main(...process.argv.slice(2, 5))
