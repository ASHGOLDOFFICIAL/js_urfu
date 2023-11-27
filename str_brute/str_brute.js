const compareStr = (s1, s2) => {
    if (s1.length != s2.length) {
        return false;
    }
    for (let i = 0; i < s1.length; ++i) {
        if (s1[i] != s2[i]) {
            return false;
        }
    }
    return true;
}


const main = (str, substr) => {
    let substrLength = substr.length;
    const indexes = [];
    
    for (let i = 0; i < str.length - substrLength + 1; ++i) {
        if (compareStr(substr, str.slice(i, i + substrLength))) {
            indexes.push(i + 1)
        }
    }

    console.log(indexes)
}


main(process.argv[2], process.argv[3])
