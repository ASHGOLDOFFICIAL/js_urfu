const createDeltaTable = (substr) => {
    const alph = {};
    for (const letter of substr)
        alph[letter] = 0;

    const tbl = [];
    for (let i = 0; i <= substr.length; ++i)
        tbl[i] = {};

    for (let i = 0; i <= substr.length; ++i) {
        for (const c in alph) {
            const frag = substr.slice(0, i) + c;
            
            // State - Letter
            tbl[i][c] = 0;
            for (let j = 0; j < frag.length; j++) {
                if (substr.startsWith(frag.slice(j))) {
                    tbl[i][c] = frag.length - j;
                    break;
                }
            }
        }
    }

    return tbl;
} 


const main = (str, substr) => {
    const tbl = createDeltaTable(substr);
    console.table(tbl);

    const acceptState = substr.length;
    let currentState = 0;
    
    for (let i = 0; i < str.length; i++) {
        const newState = tbl[currentState][str.charAt(i)];
        currentState = newState !== undefined ? newState : 0;
        
        if (currentState === acceptState)
            console.log(i - substr.length + 1);
    }
}


main(...process.argv.slice(2, 4));

