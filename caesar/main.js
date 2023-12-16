const fs = require("fs")
const {
    Alphabet, CaesarCipher, CaesarCipherCracker
} = require("./caesar")


const getRandomInt = (max) => Math.floor(Math.random() * max)


const getFragmentOfText = (inputFile, fragmentSize) => {
    const text = fs.readFileSync(inputFile, {encoding: "utf-8"})
    const startIndex = getRandomInt(text.length - fragmentSize)
    return text.slice(getRandomInt(startIndex, startIndex + fragmentSize))
}


const main = (
    inputFile="input.txt",
    codedFile="coded.txt",
    decodedFile="decoded.txt",
    crackedFile="cracked.txt"
) => {
    let inText
    const freqTableFile = "russian.json"
    let freqTableJson
    try {
        freqTableJson = fs.readFileSync(freqTableFile, {encoding: "utf-8"})
        inText = getFragmentOfText(inputFile, 1000)
    } catch (err) {
        console.error(`Read error: ${err}`)
        return
    }
    
    const alp = new Alphabet(/[а-я|А-Я]/, 32, 'а', JSON.parse(freqTableJson))
    const shift = getRandomInt(alp.size)

    console.log(`Shift is ${shift}`)
    
    const caesarCipher = new CaesarCipher(alp, shift)
    const cracker = new CaesarCipherCracker(alp)
    
    const codedText = caesarCipher.code(inText)
    const decodedText = caesarCipher.decode(codedText)
    const [ crackedText, crackShift ] = cracker.crack(codedText)
    
    console.log(`Cracker says shift is ${crackShift}`)
    
    try {
        fs.writeFileSync(codedFile, codedText)
        fs.writeFileSync(decodedFile, decodedText)
        fs.writeFileSync(crackedFile, crackedText)
    } catch (err) {
        console.error(`Write error: ${err}`)
        return
    }
}


main(...process.argv.slice(2, 6))

