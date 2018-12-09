var inputText = `
#1 @ 1,3: 4x4
#2 @ 3,1: 4x4
#3 @ 5,5: 2x2
`;

function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map(lineText => {
            const [idText, , coordsText, sizeText] = lineText.split(' ');
            const [x0, y0] = coordsText.slice(0, -1).split(',');
            const [width, height] = sizeText.split('x');
            return {
                id: idText.slice(1),
                x0: parseInt(x0, 10),
                y0: parseInt(y0, 10),
                width: parseInt(width, 10),
                height: parseInt(height, 10),
            };
        });
}

function resolve1(input) {
    const maxX = Math.max(...input.map(order => order.x0 + order.width));
    const maxY = Math.max(...input.map(order => order.y0 + order.height));
    const myMap = Array(maxX).fill(0).map(col => Array(maxY).fill(0));

    input.forEach(({ id, x0, y0, width, height }) => {
        Array(width).fill().forEach((_, indexX) => {
            Array(height).fill().forEach((_, indexY) => {
                const posX = x0 + indexX;
                const posY = y0 + indexY;
                if (!myMap[posX][posY]) myMap[posX][posY] = [];
                myMap[posX][posY].push(id);
            });
        });
    });

    return Object.values(myMap)
        .reduce((flatArray, array) => [...flatArray, ...array], [])
        .filter(cell => cell && cell.length >= 2)
        .length;
}

function resolve2(input) {
    const myMap = {};
    const overlapCells = {};

    for (let i = 0; i < input.length; i++) {
        const order = input[i];
        for (let x = 0; x < order.width; x++) {
            for (let y = 0; y < order.height; y++) {
                const posX = order.x0 + x;
                const posY = order.y0 + y;
                if (!myMap[posX]) myMap[posX] = {};
                if (!myMap[posX][posY]) myMap[posX][posY] = [];
                myMap[posX][posY].push(order.id);
                if (myMap[posX][posY].length >= 2) myMap[posX][posY].forEach(id => overlapCells[id] = true);
            }
        }
    }

    return input
        .find(order => !overlapCells[order.id])
        .id;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);