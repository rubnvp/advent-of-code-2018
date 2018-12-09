

function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map(line => line.split(''))
}

function resolve1(input) {
    const counts2and3 = input
        .map(line => {
            const charCounts = line
                .reduce((counts, char) => {
                    counts[char] = counts[char] ? counts[char] + 1 : 1;
                    return counts;
                }, {});
            const countValues = Object.values(charCounts);
            return {
                2: countValues.includes(2),
                3: countValues.includes(3),
            };
        })
        .reduce((totalCounts, countValues) => {
            totalCounts[2] = countValues[2] ? totalCounts[2] + 1 : totalCounts[2];
            totalCounts[3] = countValues[3] ? totalCounts[3] + 1 : totalCounts[3];
            return totalCounts;
        }, { 2: 0, 3: 0 });
    return counts2and3[2] * counts2and3[3];
}

function resolve2(input) {
    return input
        .map((line1, index) => input // compare with other lines
            .slice(index + 1)
            .map(line2 => line1
                .filter((char, i) => char === line2[i])
                .join('')
            )
        )
        .reduce((flatArray, array) => [...flatArray, ...array], [])
        .find(line => input[0].length - line.length === 1);
}

const inputParsed = parseInput(inputText);
const result = resolve2(inputParsed);

console.log(result)