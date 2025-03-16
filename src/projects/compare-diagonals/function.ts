export function diagonalDifference(arr: number[][]): number {
    const pathLtoR = Array.from({ length: arr[0].length }, (_, i) => [i, i]);

    let width = arr[0].length;
    const pathRtoL = Array.from(pathLtoR, (v) => {
        width = width - 1;
        return [v[0], width]
    });
    const ltr = pathLtoR.reduce((acc, [x, y]) => acc += arr[x][y], 0);
    const rtl = pathRtoL.reduce((acc, [x, y]) => acc += arr[x][y], 0);

    return Math.abs(ltr - rtl);
}