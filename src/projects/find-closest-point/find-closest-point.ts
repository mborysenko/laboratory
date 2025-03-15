type Direction = 'up' | 'down' | 'left' | 'right';
const move = (direction: Direction, target: [row: number, col: number], distance = 1): [row: number, col: number] => {
    const [row, col] = target;

    const moves: Record<Direction, Function> = {
        up: (row: number) => {
            return row - distance;
        },
        down: (row: number) => {
            return row + distance;
        },
        left: (col: number) => {
            return col - distance;
        },
        right: (col: number) => {
            return col + distance;
        },
    }

    if (["up", "down"].includes(direction)) {
        return [moves[direction](row), col];
    }

    return [row, moves[direction](col)];
}
function* createRoute(done: boolean = false) {
    var firstRun = true;
    let r = 2, d = 2, l = 2, u = 2;
    if(firstRun) {
        firstRun = false;
        yield [
            ['right', r],
            ['down', d],
            ['left', l],
            ['up', u],
        ];
    }

    while (!done) {
        r += 2;
        d += 2;
        l += 2;
        u += 2;

        yield [
            ['right', r],
            ['down', d],
            ['left', l],
            ['up', u],
        ];
    }
}
export const findClosestPoint = (target: [row: number, col: number], grid: number[][]) => {
    const [targetRow, targetCol] = target;
    const movesGenerator = createRoute();

    let keepIterating = true;
    let currentDistance = 0;
    let closestId = 0;
    let pointer: [row: number, col: number] = [...target];

    while (keepIterating) {
        pointer = [pointer[0] - 1, pointer[1] - 1];

        const route = movesGenerator.next().value as [Direction, number][];

        for (let [direction, steps] of route) {
            while (steps > 0) {
                const [nextRow, nextCol] = pointer;
                pointer = move(direction, pointer, 1);

                if(nextRow < 0 || nextCol < 0 || nextRow >= grid.length || nextCol >= grid[0].length) {
                    steps--;
                    continue;
                }

                const nextValue = grid[nextRow][nextCol];

                if (nextValue <= 1000 || nextValue === undefined) {
                    steps--;
                    continue;
                }

                const nextDistance = Math.sqrt(Math.pow(nextRow - targetRow, 2) + Math.pow(nextCol - targetCol, 2));
                if (currentDistance === 0 || nextDistance < currentDistance) {
                    currentDistance = nextDistance;
                    closestId = nextValue;
                }

                keepIterating = false;
                steps--;
            }
        }
    }

    return closestId
}