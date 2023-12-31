class DecimalToFloatConverter {
    static NAN          = "0 11111111 1000000000000000000000"
    static POS_ZERO     = "0 00000000 0000000000000000000000"
    static NEG_ZERO     = "1 00000000 0000000000000000000000"

    static POS_INFINITY = "0 11111111 0000000000000000000000"
    static NEG_INFINITY = "0 11111111 0000000000000000000000"


    static #isNaN(str) {
        return !str.match(/^-?\d+\.?\d*$/)
    }


    static #isNegative(dec) {
        return dec[0] === "-"
    }


    static #removeMeaninglessZeroes(dec) {
        let i = this.#isNegative(dec)
        let j = dec.length - 1
    
        // First non-zero digit
        for (; dec[i] === "0"; ++i);
    
        // If dot is present, last non-zeroes digit
        if (dec.indexOf(".") !== -1)
            for (; dec[j] === "0"; --j);

        return (this.#isNegative(dec) ? "-" : "") + dec.slice(i, j + 1) 
    }


    static #getExponent(dec) {
        const localDec = this.#removeMeaninglessZeroes(dec)
        const dot = dec.indexOf(".")

        if (dot === -1)
            return localDec.length - 1
        else if (dot === 0)
            return -localDec.length + 1
        else
            return dot - 1
    }


    static #integerToBinary(num, limit=32, expand=false) {
        let localNum = num
        let bin = ""
        
        while (localNum) {
            bin = (localNum & 1).toString() + bin
            localNum = Math.floor(localNum / 2)
        }
        
        return (expand ? "0".repeat(limit - bin.length) : "") + bin
    }


    static #fractionalToBinary(num, limit=32, expand=true) {
        let localNum = num
        let bin = ""
        
        while (localNum && (bin.length < limit)) {
            localNum *= 2
            
            let bit = Math.floor(localNum)
            bin += bit.toString()
            
            if (bit)
                --localNum
        }
        
        return bin + (expand ? "0".repeat(limit - bin.length) : "")
    }


    static #denormal(sign, exponent, fractBin) {
        const exp = this.#integerToBinary(exponent)
        const mant = exp.slice(8) + fractBin.slice(1, 24)
        return `${sign} 00000000 ${mant}`.slice(1, 25)
    }


    static convert(num) {
        if (this.#isNaN(num))
            return this.NAN
        
        const [ integ, fract ] = num.split(".")
        const integBin = this.#integerToBinary(parseInt(integ))
        const fractBin = this.#fractionalToBinary(
            fract ? parseFloat("." + fract) : 0, 64
        )

        const sign = +this.#isNegative(num)
        const bin = `${integBin}.${fractBin}`
        const exponent = this.#getExponent(bin)

        let mant = `${integBin}${fractBin}`.slice(1, 24)

        if (exponent < -126 || exponent === 0 && integ.match(/-?0/))
            return (sign) ? this.NEG_ZERO : this.POS_ZERO
        if (exponent > 127)
            return (sign) ? this.NEG_INFINITY : this.POS_INFINITY

        return `${sign} ${this.#integerToBinary(127 + exponent, 8, true)} ${mant}`
    }
}


module.exports = { DecimalToFloatConverter }
