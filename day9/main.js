// var inputText = `9 players; last marble is worth 25 points`;

function parseInput(inputText) {
    const [, playersCount, maxPoints] = /(.*) players; last marble is worth (.*) points/.exec(inputText);
    return {
        playersCount,
        maxPoints,
    };
}

function resolve1({ playersCount, maxPoints }) {
    const players = Array.from({ length: playersCount }).map(n => 0);
    const marbels = Array.from({ length: maxPoints }).map((n, i) => i + 1);

    const circle = [0];
    let currentPos = 0;

    do {
        const nextMarble = marbels.shift();
        const player = (nextMarble - 1) % playersCount;
        if (nextMarble % 23 !== 0) { // normal movement
            let nextPos = currentPos + 1;
            if (nextPos >= circle.length) {
                nextPos = nextPos % circle.length;
            }
            nextPos = nextPos + 1;
            circle.splice(nextPos, 0, nextMarble);
            currentPos = nextPos;
        }
        else { // win points movement
            players[player] += nextMarble;
            let nextPos = currentPos - 7;
            if (nextPos < 0) {
                nextPos = circle.length + nextPos
            }
            const [removedMarble] = circle.splice(nextPos, 1);
            players[player] += removedMarble;
            currentPos = nextPos;
            if (currentPos === circle.length) currentPos = 0;
        }
    } while (marbels.length);

    return Math.max(...players);
}

function resolve2({ playersCount, maxPoints }) {
    maxPoints = maxPoints * 100;
    const players = Array.from({ length: playersCount }).map(n => 0);

    const initialMarble = {
        value: 0,
        prev: null,
        next: null,
    };
    initialMarble.prev = initialMarble;
    initialMarble.next = initialMarble;

    let currentMarble = initialMarble;

    console.time('time');
    let nextMarbleValue = 1;
    let i = 0;

    do {
        const player = (nextMarbleValue - 1) % playersCount;
        if (nextMarbleValue % 23 !== 0) { // normal movement
            currentMarble = currentMarble.next;
            // create new marble
            const newMarble = {
                value: nextMarbleValue,
                prev: null,
                next: null,
            };
            const prevMarble = currentMarble;
            const nextMarble = currentMarble.next;
            // assign values
            newMarble.prev = prevMarble;
            newMarble.next = nextMarble;
            // link others
            prevMarble.next = newMarble;
            nextMarble.prev = newMarble;
            currentMarble = newMarble;
        }
        else { // win points movement
            players[player] += nextMarbleValue;
            // let nextPos = currentPos - 7;
            for (i = 0; i < 7; i++) {
                currentMarble = currentMarble.prev;
            }
            players[player] += currentMarble.value;
            const prevMarble = currentMarble.prev;
            const nextMarble = currentMarble.next;
            // remove
            prevMarble.next = nextMarble;
            nextMarble.prev = prevMarble;
            currentMarble = nextMarble;
        }
        nextMarbleValue++;
    } while (nextMarbleValue <= maxPoints);

    return Math.max(...players);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);