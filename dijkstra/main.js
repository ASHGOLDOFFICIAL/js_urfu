const fs = require("fs")


const comparePriorities = (op1, op2) => {
    if (op1 === "^" || op2 === "^")
        return (op1 === "^") - (op2 === "^")
    return ((op1 === "*") || (op1 === "/")) - ((op2 === "*") || (op2 === "/"))
}


const isOperation = (sym) => /[\+\-\*\/\^]/.test(sym)


const getReversePolishString = (str) => {
    const stack = []
    const polishStr = []
    
    for (let i = 0; i < str.length; ++i) {
        // console.log(polishStr, stack)

        let num = '';
        while (i < str.length && (!isNaN(str.charAt(i)) || str.charAt(i) === "."))
            num += str.charAt(i++)
        if (num) {
            polishStr.push(parseFloat(num))
            --i
            continue
        }


        const sym = str.charAt(i)
        switch (sym) {
            case "(": 
                stack.push(sym)
                break

            case ")":
                while (stack.at(-1) != "(")
                    polishStr.push(stack.pop())
                stack.pop()
                break

            case "+":
            case "-":
            case "*":
            case "/":
            case "^":
                while (isOperation(stack.at(-1)) && comparePriorities(sym, stack.at(-1)) <= 0)
                    polishStr.push(stack.pop())
                stack.push(sym)
                break

            default:
                throw new Error(`Unexpected symbol in string: ${sym}`)
        }
    }
    
    return polishStr.concat(stack.reverse())
}


const evaluateReversePolishString = (strArr) => {
    const stack = []
    
    let op1, op2
    for (el of strArr) {
        switch (el) {
            case "+":
                stack.push(stack.pop() + stack.pop())
                break
            case "-":
                stack.push(-stack.pop() + stack.pop())
                break
            case "*":
                stack.push(stack.pop() * stack.pop())
                break
            case "/":
                op2 = stack.pop()
                op1 = stack.pop()
                stack.push(op1 / op2)
                break
            case "^":
                op2 = stack.pop()
                op1 = stack.pop()
                stack.push(op1 ** op2)
                break
            default:
                stack.push(el)
        }
    }

    return stack.pop()
}


const run_tests = (tests) => {
    const results = []
    for (let test of tests) {
        const result = {}
        result.test = test

        const polishStr = getReversePolishString(test)
        result.polishStr = polishStr.join(" ")
        
        result.answer = evaluateReversePolishString(polishStr)
        result.correctAnswer = eval(test.replaceAll("^", "**"))
        
        results.push(result)
    }
    return results
}


const main = (inputFile="input.txt", outputFile="output.txt") => {
    let fileContent
    try {
        fileContent = fs.readFileSync(inputFile, { encoding: "utf8" })
    } catch (err) {
        console.error(`Read error: ${err}`)
        return
    }
    
    tests = fileContent.replaceAll(/(?:(?!\n)\s)+/g, "").split("\n").filter(el => el)
    const results = run_tests(tests)
    console.table(results)
}


main(...process.argv.slice(2, 4))
