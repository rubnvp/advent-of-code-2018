var inputText = `
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
`;
var workersCount = 2;
var additionalSeconds = 0;

function parseInput(inputText) {
    return inputText
        .split('\n')
        .slice(1, -1)
        .map(line => {
            const [, before, after] = /Step (.) must be finished before step (.) can begin/.exec(line);
            return {
                before,
                after,
            };
        });
}

function resolve1(input) {
    const ids = Array.from(new Set(input.flatMap(dep => [dep.before, dep.after]))).sort();

    const { depend, notify } = input
        .reduce(({ depend, notify }, { before, after }) => {
            if (!depend[after]) depend[after] = [];
            if (!notify[before]) notify[before] = [];
            depend[after].push(before);
            notify[before].push(after);
            return { depend, notify };
        }, { depend: {}, notify: {} });

    const noDependIds = ids.filter(id => !depend[id]);

    const executed = [];

    do {
        const availableIds = Array
            .from(new Set(executed.flatMap(id => notify[id])))
            .concat(noDependIds)
            .filter(id => !executed.includes(id))
            .filter(id => {
                return !(depend[id] || [])
                    .find(dependId => !executed.includes(dependId));
            })
            .sort();
        const nextId = availableIds.shift();
        executed.push(nextId);
    } while (executed.length < ids.length);

    return executed.join('');
}

function resolve2(input) {
    const ids = Array.from(new Set(input.flatMap(dep => [dep.before, dep.after]))).sort();

    const { depend, notify } = input
        .reduce(({ depend, notify }, { before, after }) => {
            if (!depend[after]) depend[after] = [];
            if (!notify[before]) notify[before] = [];
            depend[after].push(before);
            notify[before].push(after);
            return { depend, notify };
        }, { depend: {}, notify: {} });

    const noDependIds = ids.filter(id => !depend[id]);

    const executed = [];

    let seconds = 0;
    const workers = Array.from({ length: workersCount })
        .map(w => ({
            task: null,
            // taskSeconds: 0,
            spentSeconds: 0,
        }));
    const DIFF = 'A'.charCodeAt(0) - 1;

    do {
        const availableIds = Array
            .from(new Set(executed.flatMap(id => notify[id]))) // all notified ids
            .concat(noDependIds) // all initial ids
            .filter(id => !executed.includes(id)) // not executed
            .filter(id => { // all dependencies executed
                return !(depend[id] || [])
                    .find(dependId => !executed.includes(dependId));
            })
            .filter(id => { // not being worked by a worker
                return !workers.map(w => w.task).includes(id);
            })
            .sort()
            .forEach(id => { // assign to a free worker
                const availableWorker = workers
                    .find(w => !w.task);
                if (availableWorker) {
                    availableWorker.task = id;
                    availableWorker.spentSeconds = 0;
                }
            });

        workers
            .filter(w => w.task)
            .forEach(w => {
                w.spentSeconds++;
                const taskTime = additionalSeconds + w.task.charCodeAt(0) - DIFF;
                if (w.spentSeconds === taskTime) {
                    executed.push(w.task);
                    w.task = null;
                }
            });

        seconds++;
    } while (executed.length < ids.length);

    return seconds;
}

const input = parseInput(inputText);
const output = resolve2(input);

console.log(output);