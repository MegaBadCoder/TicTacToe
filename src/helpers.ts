export function transposeMatrix (matrix: number[][]): number[][] {
    const result = new Array(matrix.length);
    for (let i = 0; i < matrix.length; ++i) {
      result[i] = new Array(matrix[0].length);
    }
    for (let i = 0; i < matrix.length; ++i) {
      for (let j = 0; j < matrix[0].length; ++j) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
};