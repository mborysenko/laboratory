export const formMagicSquare = (input: number[][]): number => {
    // Flatten array for easier access
    const flattenSquare = input.flat();
    // 3x3 square magic constant === 15
    // There are 8 unique solutions to a 3x3 magic square
    const squares = [
        [8, 1, 6, 3, 5, 7, 4, 9, 2],
        [4, 3, 8, 9, 5, 1, 2, 7, 6],
        [2, 9, 4, 7, 5, 3, 6, 1, 8],
        [6, 7, 2, 1, 5, 9, 8, 3, 4],
        [6, 1, 8, 7, 5, 3, 2, 9, 4],
        [8, 3, 4, 1, 5, 9, 6, 7, 2],
        [4, 9, 2, 3, 5, 7, 8, 1, 6],
        [2, 7, 6, 9, 5, 1, 4, 3, 8]
    ];
    // Now we just track which given magic square is the least distance from our matrix
    // This will report the least cost (abet, brute force-y)
    var cost = Math.min();
    for (let magicSquareEntry = 0; magicSquareEntry < squares.length; magicSquareEntry += 1) {
        const currentCost = squares[magicSquareEntry].reduce((cost, next, index) => {
            return cost + Math.abs(next - flattenSquare[index])
        }, 0);

        if (currentCost < cost) {
            cost = currentCost;
        }
    }

    return cost;
};

