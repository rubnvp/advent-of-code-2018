
function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map(num => parseInt(num, 10));
}

function resolve2(list) {
    const reaches = { 0: true };
    let exit = false;
    let init = 0;
    while (!exit) {
        init = list.reduce((sum, num) => {
            const total = sum + num;
            if (reaches[total]) {
                console.log('---------- twice in', total);
                exit = true;
            }
            else reaches[total] = true;
            return total;
        }, init);
    }
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);