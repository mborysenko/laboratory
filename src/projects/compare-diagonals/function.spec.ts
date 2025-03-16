import { diagonalDifference } from "./function";

describe('compare-diagonals', () => {
    it("should return absolute difference between diagonals' sums", () => {
        const result1 = diagonalDifference([
            [11, 2, 4],
            [4, 5, 6],
            [10, 8, -12],
        ]);

        expect(result1).toBe(15);
        const result2 = diagonalDifference([
            [11, 2, 4, 7],
            [4, 5, 6, 9],
            [10, 8, -12, 3],
            [13, 2, -6, 7],
        ]);

        expect(result2).toBe(23);
    });
});