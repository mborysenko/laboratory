export function birthdayCakeCandles(candles: number[] = []): number {
    if (!candles.length || candles.length === 1) {
        return candles.length;
    }

    const result = candles.reduce((acc, next, index) => {
        if (index === 0) return acc;

        if (acc.tallest < next) {
            acc.tallest = next;
            acc.count = 1;
            return acc;
        }

        if (acc.tallest > next) {
            return acc;
        }

        acc.count++;
        return acc;
    }, {
        tallest: candles[0],
        count: 1,
    });

    return result.count;
}