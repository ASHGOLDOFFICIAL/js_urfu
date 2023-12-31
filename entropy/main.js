const entropy = (str) => {
    const alph = [];

    for (const c of str)
        alph[c] = alph[c] ? ++alph[c] : 1;

    let alphSize = 0;
    for (const _ in alph)
        ++alphSize;

    let h = 0;
    for (const letter in alph) {
        const p = alph[letter] / str.length;
        console.log(`${letter} - ${p}`);
        
        if (alphSize > 1)
            h -= p * (Math.log(p) / Math.log(alphSize));
    }

    return h
}

console.log("Entropy:", entropy(process.argv[2]));
