var inputText = `
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
`;

function parseInput(inputText) {
    let guardId = null;

    return inputText
        .split('\n')
        .slice(1, -1)
        .sort()
        .map(line => {
            const dateTime = line.slice(1, 'YYYY-MM-DD HH:mm'.length + 1);
            const [day] = dateTime.split(' ');
            const [, minute] = dateTime.split(':');

            if (line.endsWith('begins shift')) {
                const [, newGuardId] = /Guard #(.*) begins shift/.exec(line);
                guardId = newGuardId;
                return null;
            }

            return {
                day,
                guardId,
                minute: parseInt(minute, 10),
            };
        })
        .filter(event => event); // remove begins shift events
}

function resolve1(events) {
    const eventsByDay = events
        .reduce((days, { day, guardId, minute }) => {
            if (!days[day]) days[day] = {};
            const dayInfo = days[day];

            dayInfo['day'] = day;
            dayInfo['guardId'] = guardId;
            if (!dayInfo['events']) dayInfo['events'] = [];
            dayInfo['events'].push(minute);

            return days;
        }, {});

    for (const day in eventsByDay) { // add sleep intervals and minutesSleeping
        const dayInfo = eventsByDay[day];

        const sleepIntervals = [];

        let sleep = false;
        let minute = 0;

        dayInfo.events.forEach(eventMinute => {
            if (sleep) {
                sleepIntervals.push([minute, eventMinute - 1]);
            }
            minute = eventMinute;
            sleep = !sleep;
        });

        if (sleep) {
            sleepIntervals.push([minute, 60]);
        }

        const minutesSleeping = sleepIntervals
            .reduce((total, interval) => {
                return total + (interval[1] - interval[0]) + 1;
            }, 0);

        dayInfo['sleepIntervals'] = sleepIntervals;
        dayInfo['minutesSleeping'] = minutesSleeping;
    }

    const sleepsByGuard = Object.values(eventsByDay)
        .reduce((sleepsByGuard, { guardId, minutesSleeping, sleepIntervals }) => {
            if (!sleepsByGuard[guardId]) sleepsByGuard[guardId] = {};
            if (!sleepsByGuard[guardId]['minutes']) sleepsByGuard[guardId]['minutes'] = [];
            if (!sleepsByGuard[guardId]['intervals']) sleepsByGuard[guardId]['intervals'] = [];

            sleepsByGuard[guardId]['minutes'].push(minutesSleeping);
            sleepsByGuard[guardId]['intervals'] = sleepsByGuard[guardId]['intervals'].concat(sleepIntervals);
            return sleepsByGuard;
        }, {});

    const guardIds = [...(new Set(events.map(event => event.guardId)))];

    const mostSleepyGuard = guardIds
        .map(guardId => ({
            id: guardId,
            intervals: sleepsByGuard[guardId]['intervals'],
            minutes: sleepsByGuard[guardId]['minutes'] // calculate total minutes sleeping
                .reduce((sum, minute) => sum + minute, 0)
        }))
        .reduce((max, guard) => {
            return guard.minutes > max.minutes ? guard : max;
        });

    const minutesCount = {};
    mostSleepyGuard.intervals.forEach(([start, end]) => {
        for (let minute = start; minute <= end; minute++) {
            if (!minutesCount[minute]) minutesCount[minute] = 0;
            minutesCount[minute]++;
        }
    });

    return parseInt(mostSleepyGuard.id, 10) * Object.keys(minutesCount)
        .map(id => ({
            id,
            count: minutesCount[id],
        }))
        .reduce((max, minute) => {
            return minute.count > max.count ? minute : max;
        })
        .id;
}

function resolve2(events) {
    const eventsByDay = events
        .reduce((days, { day, guardId, minute }) => {
            if (!days[day]) days[day] = {};
            const dayInfo = days[day];

            dayInfo['day'] = day;
            dayInfo['guardId'] = guardId;
            if (!dayInfo['events']) dayInfo['events'] = [];
            dayInfo['events'].push(minute);

            return days;
        }, {});

    for (const day in eventsByDay) { // add intervals
        const dayInfo = eventsByDay[day];

        const intervals = [];

        let sleep = false;
        let minute = 0;

        dayInfo.events.forEach(eventMinute => {
            if (sleep) intervals.push([minute, eventMinute - 1]);
            minute = eventMinute;
            sleep = !sleep;
        });

        if (sleep) intervals.push([minute, 60]);

        dayInfo['intervals'] = intervals;
    }

    const intervalsByGuard = Object.values(eventsByDay)
        .reduce((intervalsByGuard, { guardId, intervals }) => {
            if (!intervalsByGuard[guardId]) intervalsByGuard[guardId] = [];
            intervalsByGuard[guardId] = intervalsByGuard[guardId].concat(intervals);
            return intervalsByGuard;
        }, {});

    const guardMinutesCount = {};
    for (const guardId in intervalsByGuard) {
        guardMinutesCount[guardId] = {};
        minutesCount = guardMinutesCount[guardId];
        const intervals = intervalsByGuard[guardId];
        intervals.forEach(([start, end]) => {
            for (let minute = start; minute <= end; minute++) {
                if (!minutesCount[minute]) minutesCount[minute] = 0;
                minutesCount[minute]++;
            }
        })
    }

    const guardWithMostRepeatedMinute = Object.keys(guardMinutesCount)
        .map(guardId => ({
            id: guardId,
            maxMinute: Object.keys(guardMinutesCount[guardId])
                .map(minute => ({
                    minute,
                    count: guardMinutesCount[guardId][minute],
                }))
                .reduce((max, minuteCount) => {
                    return minuteCount.count > max.count ? minuteCount : max;
                })
        }))
        .reduce((max, guardMaxMinute) => {
            return guardMaxMinute.maxMinute.count > max.maxMinute.count ? guardMaxMinute : max;
        });

    return parseInt(guardWithMostRepeatedMinute.id, 10) * parseInt(guardWithMostRepeatedMinute.maxMinute.minute, 10);
}

const input = parseInput(inputText);
const result = resolve2(input);

console.log(result);