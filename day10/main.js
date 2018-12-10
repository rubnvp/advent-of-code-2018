var inputText = `
position=< 9,  1> velocity=< 0,  2>
position=< 7,  0> velocity=<-1,  0>
position=< 3, -2> velocity=<-1,  1>
position=< 6, 10> velocity=<-2, -1>
position=< 2, -4> velocity=< 2,  2>
position=<-6, 10> velocity=< 2, -2>
position=< 1,  8> velocity=< 1, -1>
position=< 1,  7> velocity=< 1,  0>
position=<-3, 11> velocity=< 1, -2>
position=< 7,  6> velocity=<-1, -1>
position=<-2,  3> velocity=< 1,  0>
position=<-4,  3> velocity=< 2,  0>
position=<10, -3> velocity=<-1,  1>
position=< 5, 11> velocity=< 1, -2>
position=< 4,  7> velocity=< 0, -1>
position=< 8, -2> velocity=< 0,  1>
position=<15,  0> velocity=<-2,  0>
position=< 1,  6> velocity=< 1,  0>
position=< 8,  9> velocity=< 0, -1>
position=< 3,  3> velocity=<-1,  1>
position=< 0,  5> velocity=< 0, -1>
position=<-2,  2> velocity=< 2,  0>
position=< 5, -2> velocity=< 1,  2>
position=< 1,  4> velocity=< 2,  1>
position=<-2,  7> velocity=< 2, -2>
position=< 3,  6> velocity=<-1, -1>
position=< 5,  0> velocity=< 1,  0>
position=<-6,  0> velocity=< 2,  0>
position=< 5,  9> velocity=< 1, -2>
position=<14,  7> velocity=<-2,  0>
position=<-3,  6> velocity=< 2, -1>
`;

function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map(line => {
            const [, x0, y0, vX, vY] = /position=<(.*), (.*)> velocity=<(.*), (.*)>/.exec(line);
            return {
                x0: parseInt(x0, 10),
                y0: parseInt(y0, 10),
                vX: parseInt(vX, 10),
                vY: parseInt(vY, 10),
            }
        });
}

function resolve1(stars) {
    function getStarPositionsAt(time) {
        return stars.map(({ x0, y0, vX, vY }) => ({
            x: x0 + vX * time,
            y: y0 + vY * time,
        }));
    }

    function getSkyWidthAt(time) {
        const startPositions = getStarPositionsAt(time);
        const maxX = Math.max(...startPositions.map(s => s.x));
        const minX = Math.min(...startPositions.map(s => s.x));
        return maxX - minX;
    };

    let second = 0;
    let widthDiff;
    do {
        second++;
        widthDiff = getSkyWidthAt(second + 1) - getSkyWidthAt(second);
    } while (widthDiff < 0); // find when the width is minimum and starts to grow

    return getStarPositionsAt(second);
}

function resolve2(stars) {
    function getStarPositionsAt(time) {
        return stars.map(({ x0, y0, vX, vY }) => ({
            x: x0 + vX * time,
            y: y0 + vY * time,
        }));
    }

    function getSkyWidthAt(time) {
        const startPositions = getStarPositionsAt(time);
        const maxX = Math.max(...startPositions.map(s => s.x));
        const minX = Math.min(...startPositions.map(s => s.x));
        return maxX - minX;
    };

    let second = 0;
    let widthDiff;
    do {
        second++;
        widthDiff = getSkyWidthAt(second + 1) - getSkyWidthAt(second);
    } while (widthDiff < 0); // find when the width is minimum and starts to grow

    return second;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);

// // paint the sky to check the message
// const minX = Math.min(...output.map(s => s.x));
// const maxX = Math.max(...output.map(s => s.x));
// const minY = Math.min(...output.map(s => s.y));
// const maxY = Math.max(...output.map(s => s.y));
// document.getElementById('app').innerHTML = `
// <svg width="600" height="200" viewBox="${minX} ${minY} ${maxX} ${maxY}">
// ${
//     output
//         .map(({ x, y }) =>
//             `<circle cx="${x}" cy="${y}" r="1"/>`
//         ).join('')
//     }
// </svg>
// `;