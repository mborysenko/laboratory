import { birthdayCakeCandles } from "./birthday-cake-candles";

describe(
    "birthdayCakeCandles",
    () => {
        it("should return tallest candles count", () => {
            const zeroCount = birthdayCakeCandles([]);
            expect(zeroCount).toBe(0);

            const aloneCount = birthdayCakeCandles([5]);
            expect(aloneCount).toBe(1);

            const tallestCount = birthdayCakeCandles([5, 12, 3, 4, 7, 9, 12, 9, 10, 11]);
            expect(tallestCount).toBe(2);

        })
    })
