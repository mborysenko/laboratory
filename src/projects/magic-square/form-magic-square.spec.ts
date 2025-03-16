import { formMagicSquare } from "./form-magic-square";

describe('formMagicSquare', () => {
    it('should return cost of the conversion', () => {
        const cost = formMagicSquare([
            [3, 6, 9],
            [7, 2, 6],
            [4, 9, 1]
        ]);

        expect(cost).toBe(20);
    })
})