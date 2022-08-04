type Figure = 1 | -1 | 0; 

export function transposeMatrix (matrix: Figure[][]): Figure[][] {
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