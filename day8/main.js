var inputText = `2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2`;

function parseInput(inputText) {
    return inputText
        .split(' ')
        .map(num => parseInt(num, 10));
}

function resolve1(input) {
    let sumMeta = 0;

    function parseNode() {
        const childrenCount = input.shift();
        const metaCount = input.shift();

        const children = Array.from({ length: childrenCount })
            .map(n => parseNode());
        const metadata = Array.from({ length: metaCount })
            .map(n => {
                const meta = input.shift();
                sumMeta += meta;
                return meta;
            });

        return {
            children,
            metadata,
        };
    }
    parseNode();

    return sumMeta;
}

function resolve2(input) {
    function parseNode() {
        const childrenCount = input.shift();
        const metaCount = input.shift();

        const children = Array.from({ length: childrenCount })
            .map(n => parseNode());
        const metadata = Array.from({ length: metaCount })
            .map(n => input.shift());

        return {
            children,
            metadata,
        };
    }
    const root = parseNode();

    function getNodeValue({ children, metadata }) {
        if (!children.length) {
            return metadata.reduce((sum, value) => sum + value, 0);
        }
        return metadata
            .map(value => children[value - 1])
            .filter(child => child)
            .map(child => getNodeValue(child))
            .reduce((sum, value) => sum + value, 0);
    }

    return getNodeValue(root);
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);