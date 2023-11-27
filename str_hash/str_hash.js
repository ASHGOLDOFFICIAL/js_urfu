const hash = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h += s.charCodeAt(i);
    }
    return h;
}


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
    let substrHash = hash(substr);
    let substrLength = substr.length;
    let strFragHash = hash(str.slice(0, substrLength));
    const indexes = [];

    if ((strFragHash === substrHash)
        && compareStr(substr, str.slice(0, substrLength))) {
        indexes.push(1)
    }
    
    // 1010 10 1010 - s[0] + s[2]
    for (let i = 1; i < str.length - substrLength + 1; ++i) {
        strFragHash = strFragHash
            - hash(str.charAt(i - 1))
            + hash(str.charAt(i + substrLength - 1));

        if ((strFragHash === substrHash)
            && (compareStr(substr, str.slice(i, i + substrLength)))) {
            indexes.push(i + 1)
        }
    }

    console.log(indexes)
}


main(process.argv[2], process.argv[3])
