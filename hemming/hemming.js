const encode = (e) => {
    let bits = document.getElementById("input").value
    let additionalBits = ((1*bits[0] + 1*bits[1] + 1*bits[3]) & 1).toString() +
                         ((1*bits[1] + 1*bits[2] + 1*bits[3]) & 1).toString() +
                         ((1*bits[0] + 1*bits[2] + 1*bits[3]) & 1).toString()

    document.getElementById("coded").value = bits + additionalBits
}


const check = (e) => {
    let bits = document.getElementById("coded").value
    
    const diagram1Parity = (1*bits[0] + 1*bits[1] + 1*bits[3] + 1*bits[4]) & 1
    const diagram2Parity = (1*bits[1] + 1*bits[2] + 1*bits[3] + 1*bits[5]) & 1
    const diagram3Parity = (1*bits[0] + 1*bits[2] + 1*bits[3] + 1*bits[6]) & 1
    const sum = (diagram1Parity << 2) + (diagram2Parity << 1) + diagram3Parity
    
    /*
     * 000 (0) -> nul
     * 001 (1) -> 6
     * 010 (2) -> 5
     * 011 (3) -> 2
     * 100 (4) -> 4
     * 101 (5) -> 0
     * 110 (6) -> 1
     * 111 (7) -> 3
     */

    let indexOfError;
    switch (sum) {
        case 0:
            indexOfError = null;
            break;
        case 1:
            indexOfError = 6;
            break;
        case 2:
            indexOfError = 5;
            break;
        case 3:
            indexOfError = 2;
            break;
        case 4:
            indexOfError = 4;
            break;
        case 5:
            indexOfError = 0;
            break;
        case 6:
            indexOfError = 1;
            break;
        case 7:
            indexOfError = 3;
            break;
    }
    
    let fixedString = bits;
    let resultMessage = "Ошибки не было";
    if (indexOfError != null) {
        fixedString =
            bits.substring(0, indexOfError)
            + ((1*bits[indexOfError]) ? "0" : "1")
            + bits.substring(indexOfError + 1, bits.length);
        resultMessage = "Ошибка была в бите по номеру " + (indexOfError + 1)
            + ", если считать слева направо.";
    }

    document.getElementById("output").value = fixedString;
    document.getElementById("result").textContent = resultMessage;
}


document.getElementById("input-button").addEventListener("click", encode)
document.getElementById("check-button").addEventListener("click", check)
