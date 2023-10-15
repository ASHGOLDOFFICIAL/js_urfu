class Node {
    constructor(letter, freq, leftChild, rightChild) {
        this.letter = letter
        this.freq = freq
        this.leftChild = leftChild
        this.rightChild = rightChild
        this.used = false
    }
}


const getCharTable = (node, digit='', charTable=[]) => {
    charTable.push([node.letter, digit])

    if (node.leftChild) {
        getCharTable(node.leftChild, digit + '0', charTable)
        getCharTable(node.rightChild, digit + '1', charTable)
    }

    return charTable
}


const main = (str) => {
    if (!str) {
        console.error("Not enough argumemts: expected string")
        return
    }

    let tree = []
    let unusedNodes = 0

    for (let i = 0; i < str.length; i++) {
        let found = false
        for (let j = 0; j < tree.length; j++) {
            if (tree[j].letter === str[i]) {
                tree[j].freq++
                found = true
            }
        }
        if (!found) {
            tree.push(new Node(str[i], 1))
            unusedNodes++
        }
    }

    while (unusedNodes != 1) {

        // Находим два наиболее редко встречаемых неиспользованных узла.
        const lowFreqNodes = [null, null]
        for (let i = 0; i < tree.length; i++) {

            // Если данный элемент используется, пропускаем его.
            if (tree[i].used) {
                continue
            }

            // Если нет первого элемента или данный элемент встречается
            // реже первого, то этот элемент становится первым.
            if (!lowFreqNodes[1] || tree[i].freq <= lowFreqNodes[1].freq) {
                lowFreqNodes[1] = tree[i]
            }

            // Если нет нулевого элемента в массиве с наиболее редко
            // встречаемыми элементами или этот элемент встречается реже, то
            // данный элемент становится наименнее встречаемым.
            //
            // Заметим, что если этот элемент выше был назначен первым, то,
            // если он пройдёт эту проверку, первый элемент всё равно
            // перезапишется.
            if (!lowFreqNodes[0] || tree[i].freq <= lowFreqNodes[0].freq) {
                lowFreqNodes[1] = lowFreqNodes[0]
                lowFreqNodes[0] = tree[i]
            }

        }

        // Создадим новый узел в дереве.
        if (lowFreqNodes[0] && lowFreqNodes[1]) {
            const parentNode = new Node(
                lowFreqNodes[0].letter + lowFreqNodes[1].letter,
                lowFreqNodes[0].freq + lowFreqNodes[1].freq,
                lowFreqNodes[0],
                lowFreqNodes[1]
            )
            tree.push(parentNode)
            
            // Помечаем их как использованных. Уменьшаем счётчик
            // неиспользованных узлов (два убралось, один добавился).
            lowFreqNodes[0].used = true
            lowFreqNodes[1].used = true
            unusedNodes--
        }
    }

    const nodeCodes = getCharTable(tree[tree.length - 1])

    // Выводим коды узлов для единичных символов.
    for (const nodeCode of nodeCodes) {
        if (nodeCode[0].length == 1) {
            console.log(nodeCode[0] + " - " + nodeCode[1])
        }
    }
}


main(process.argv[2])

