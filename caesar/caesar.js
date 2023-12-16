class Alphabet {
    constructor(regex, size, fll, freqTable) {
        this.regex = regex
        this.freqTable = freqTable
        this.size = size
        
        // First/Last lowercase letter
        this.fll = fll
        this.lll = String.fromCharCode(fll.charCodeAt(0) + this.size - 1)
        
        // First/Last uppercase letter
        this.ful = this.fll.toUpperCase()
        this.lul = this.lll.toUpperCase()
    }
}


class CaesarCipher {
    constructor(alphabet, shift) {
        this.alphabet = alphabet
        this.shift = shift
    }

    code(text, shift=this.shift) {
        let coded = ""
        for (const letter of text) {
            if (!letter.match(this.alphabet.regex)) {
                coded += letter
                continue
            }

            if (letter === letter.toUpperCase()) {
                if (letter.charCodeAt(0) + shift > this.alphabet.lul.charCodeAt(0)) {
                    const charCode = letter.charCodeAt(0) - (this.alphabet.size - shift)
                    coded += String.fromCharCode(charCode)
                    continue
                }
            } else {
                if (letter.charCodeAt(0) + shift > this.alphabet.lll.charCodeAt(0)) {
                    const charCode = letter.charCodeAt(0) - (this.alphabet.size - shift)
                    coded += String.fromCharCode(charCode)
                    continue
                }
            }

            coded += String.fromCharCode(letter.charCodeAt(0) + shift)
        }
        return coded
    }

    decode(text) {
        return this.code(text, this.alphabet.size - this.shift)
    }
}


class CaesarCipherCracker {
    constructor(alphabet) {
        this.alphabet = alphabet
    }

    crack(text) {
        const originalFreqTable = this.#makeFreqTable(text)
        const diffArray = new Array(this.alphabet.size)
        
        for (let shift = 0; shift < this.alphabet.size; ++shift) {
            const freqTable = this.#shiftFreqTable(originalFreqTable, shift)
            diffArray[shift] = this.#difference(freqTable)
        }
        
        const shift = (this.alphabet.size
            - diffArray.indexOf(Math.min(...diffArray)))
            % this.alphabet.size
        const cipher = new CaesarCipher(this.alphabet, shift)
        return [ cipher.decode(text), shift ]
    }

    #initFreqTable() {
        const freqTable = {}
        for (const letter in this.alphabet.freqTable)
            freqTable[letter] = 0
        return freqTable
    }

    #makeFreqTable(text) {
        let letterCount = 0
        const freqTable = this.#initFreqTable()
        
        for (const char of text) {
            if (!char.match(this.alphabet.regex))
                continue
            ++freqTable[char.toLowerCase()]
            ++letterCount
        }

        for (const prop in freqTable)
            freqTable[prop] *= 100 / letterCount

        return freqTable
    }

    #difference(freqTable) {
        let diff = 0
        for (const letter in this.alphabet.freqTable)
            diff += Math.abs(this.alphabet.freqTable[letter] - freqTable[letter])
        return diff
    }

    #shiftFreqTable(freqTable, shift) {
        const newFreqTable = this.#initFreqTable()
        
        for (const letter in freqTable) {
            let newLetter = String.fromCharCode(letter.charCodeAt(0) + shift)

            if (letter.charCodeAt(0) + shift > this.alphabet.lll.charCodeAt(0)) {
                const charCode = letter.charCodeAt(0) - (this.alphabet.size - shift)
                newLetter = String.fromCharCode(charCode)
            }
            
            newFreqTable[newLetter] = freqTable[letter]
        }

        return newFreqTable
    }
}


module.exports = { Alphabet, CaesarCipher, CaesarCipherCracker }

