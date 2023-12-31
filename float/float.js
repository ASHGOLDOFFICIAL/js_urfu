const fs = require("fs")
const { DecimalToFloatConverter } = require("./DecimalToFloatConverter")
const { FloatCalc } = require("./FloatCalc")


const parseInput = (str) => {
    /* ADDITION:
     *    a + b
     *   -a + b
     *    a + -b
     *   -a + -b
     *
     * SUBSTRACTION
     *    a - b
     *   -a - b
     *    a - -b
     *   -a - -b
     */

    const plusIndex = str.indexOf("+", 1)
    const minusIndex = str.indexOf("-", 1)
    
    // It means that they both are -1
    if (plusIndex === minusIndex)
        throw new Error(`Couldn't find the operation`)
    
    const operationIndex = (plusIndex * minusIndex < 0)
        ? Math.max(plusIndex, minusIndex)
        : Math.min(plusIndex, minusIndex)
    const num1 = +str.slice(0, operationIndex)
    const num2 = +str.slice(operationIndex + 1, str.length)
    
    const operation = (operationIndex === plusIndex) ? "+" : "-"
    
    return { num1, num2, operation }
} 


const main = (command, inputFile="in.txt") => {
    let inText
    try {
        inText = fs.readFileSync(
            inputFile, {encoding: "utf-8"}
        ).replace(/\s/, "")
    } catch (err) {
        console.error(`Read error: ${err}`)
        return
    }

    let outText
    switch (command) {
        case "conv":
            outText = DecimalToFloatConverter.convert(inText.replace("+", ""))
            break
        case "calc":
            const { num1, num2, operation } = parseInput(inText)
            console.log(num1, num2, operation)
            
            if (operation === "+")
                outText = FloatCalc.add(num1, num2)
            else
                outText = FloatCalc.sub(num1, num2)

            break
        default:
            console.error(`Unknown command: ${command}`)
            return
    }

    console.log(outText)
}


main(...process.argv.slice(2, 4))

