var inputText = 'dabAcCaCBAcCcaDA';

function parseInput(inputText) {
    return inputText
        .split('')
        .map(char => char.charCodeAt(0));
}

function resolve1(initialCodes) {
    const DIFF = 'a'.charCodeAt(0) - 'A'.charCodeAt(0); // 32

    let codes = [];
    let newCodes = initialCodes;

    do {
        let i = 0;
        codes = newCodes;
        newCodes = [];
        do {
            const code = codes[i];
            const nextCode = codes[i + 1];
            if (Math.abs(code - nextCode) === DIFF) {
                i += 2;
            }
            else {
                newCodes.push(code);
                i++;
            }
        } while (i < codes.length);
    } while (newCodes.length !== codes.length);

    return newCodes.length;
    // .map(code => String.fromCharCode(code))
    // .join('');
}

function resolve2(polymer) {
    const DIFF = 'a'.charCodeAt(0) - 'A'.charCodeAt(0); // 32

    function reactPolymer(polymer) {
        let codes = [];
        let newCodes = polymer;
        do {
            let i = 0;
            codes = newCodes;
            newCodes = [];
            do {
                const code = codes[i];
                const nextCode = codes[i + 1];
                if (Math.abs(code - nextCode) === DIFF) {
                    i += 2;
                }
                else {
                    newCodes.push(code);
                    i++;
                }
            } while (i < codes.length);
        } while (newCodes.length !== codes.length);
        return codes.length;
    }

    const codeA = 'A'.charCodeAt(0);
    const codeZ = 'Z'.charCodeAt(0);
    const units = Array.from(new Set(polymer))
        .filter(code => codeA <= code && code <= codeZ);

    const unitLength = units.map(unit => {
        const polymerWithoutUnit = polymer
            .filter(code => code !== unit && code !== unit + DIFF);
        return {
            unit: String.fromCharCode(unit),
            length: reactPolymer(polymerWithoutUnit),
        };
    })

    return unitLength
        .reduce((min, unit) => unit.length < min.length ? unit : min);
}

const input = parseInput(inputText);
const result = resolve2(input);

console.log(result);