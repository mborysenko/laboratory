import { findClosestPoint } from "./find-closest-point";

describe("findClosestPoint", () => {
    it("should return the closest coordinate using smart algo", () => {
        const targetCoordinates: [number, number] = [5, 4];
        const grid = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1000, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1002, 0, 0, 0],
            [0, 1001, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1003, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        // const grid = [
        //     [1002, 126,  1005, 128, 129, 130, 131],
        //     [148,  109,  110, 111, 112, 113, 132],
        //     [147,  124,  101, 102, 103, 114, 133],
        //     [146,  123,  108, 100, 1004, 115, 1001],
        //     [145,  122,  107, 106, 1006, 116, 135],
        //     [144,  121,  120, 119, 118, 117, 136],
        //     [143,  1003, 141, 140, 139, 138, 137],
        // ];

        const closest = findClosestPoint(targetCoordinates, grid);
        expect(closest).toBe(1003);
    });
})

