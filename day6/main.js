var inputText = `
1, 1
1, 6
8, 3
3, 4
5, 5
8, 9
`;
var MAX_DIST = 32;

function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map((line, index) => {
            const [x, y] = line.split(', ');
            return {
                id: String.fromCharCode(index + 65), // 65 = 'A'
                x: parseInt(x, 10),
                y: parseInt(y, 10),
            };
        });
}

function resolve1(positions) {
    const maxX = Math.max(...positions.map(pos => pos.x)) + 1;
    const maxY = Math.max(...positions.map(pos => pos.y)) + 1;

    const myMap = Array.from({ length: maxY + maxX * 2 }).fill([]) // make the map big enough
        .map(col => Array.from({ length: maxX + maxY * 2 }).fill('.'));

    positions = positions // rewrite positions to center the old map
        .map(({ id, x, y }) => ({
            id,
            x: x + maxY,
            y: y + maxX,
        }));

    function getDistance(x0, y0, x1, y1) {
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

    // fill the map
    myMap.forEach((row, y) => {
        row.forEach((col, x) => {
            const minPos = positions
                .map(pos => ({
                    pos,
                    distance: getDistance(x, y, pos.x, pos.y)
                }))
                .reduce((mins, point) => {
                    return point.distance < mins[0].distance
                        ? [point]
                        : point.distance === mins[0].distance
                            ? [...mins, point]
                            : mins;

                }, [{ distance: Infinity }])

            if (minPos.length === 1) {
                myMap[y][x] = minPos[0].pos.id;
            }
        });
    });

    const sides = myMap
        .reduce((sides, row) => {
            sides.left.push(row[0]);
            sides.right.push(row.slice(-1)[0]);
            return sides;
        }, {
                top: myMap[0],
                right: [],
                bottom: myMap.slice(-1)[0],
                left: []
            });

    const corners = new Set(Object.values(sides).flatMap(l => l));

    const idCounts = myMap
        .flatMap(l => l)
        .filter(id => !corners.has(id))
        .reduce((idCounts, id) => {
            if (!idCounts[id]) idCounts[id] = 0;
            idCounts[id]++;
            return idCounts;
        }, {});

    return Math.max(...Object.values(idCounts));
}

function resolve2(positions) {
    const maxX = Math.max(...positions.map(pos => pos.x)) + 1;
    const maxY = Math.max(...positions.map(pos => pos.y)) + 1;

    const myMap = Array.from({ length: maxY + maxX * 2 }).fill([]) // make the map big enough
        .map(col => Array.from({ length: maxX + maxY * 2 }).fill('.'));

    positions = positions // rewrite positions to center the old map
        .map(({ id, x, y }) => ({
            id,
            x: x + maxY,
            y: y + maxX,
        }));

    function getDistance(x0, y0, x1, y1) {
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

    // fill the map
    myMap.forEach((row, y) => {
        row.forEach((col, x) => {
            const sumPos = positions
                .map(pos => getDistance(x, y, pos.x, pos.y))
                .reduce((sum, distance) => sum + distance);
            if (sumPos < MAX_DIST) {
                myMap[y][x] = '#';
            }
        });
    });

    return myMap
        .flatMap(l => l)
        .filter(char => char === '#')
        .length;
}

const input = parseInput(inputText);
const result = resolve2(input);

console.log(result);

// // paint the map for debugging reasons
// document.getElementById('app').innerHTML = `
// <table>
//     ${
//     result.map(row => `
//         <tr>
//             ${
//         `<td>${row.join('</td><td>')}</td>`
//         }
//         </tr>
//         `)
//     }
// </table>
// `;