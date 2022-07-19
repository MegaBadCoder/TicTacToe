import { Board } from './Board';
import { transposeMatrix } from './helpers';

const canvas = document.querySelector('#game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

export class Game {
    public currentPlayerToc: Boolean = true;
    private Board = new Board();
    public gameStatus: number = 0;
   
    readonly sizeMatrices: number[] = [3, 5, 7];
    public winner: number = -1;

    public initGame() {
        this.Board.assignDimensions(this.sizeMatrices[0]);
        canvas.addEventListener('click', this.clickOnBoard.bind(this))
    }

    private startNewGame() {
        this.Board.assignDimensions(this.sizeMatrices[0]);
    }

    private clickOnBoard(e) {
        const x = Math.floor((e.clientX - canvas.offsetLeft) / this.Board.tile_size);
        const y = Math.floor((e.clientY - canvas.offsetTop) / this.Board.tile_size);
        
        if (this.gameStatus === 2 || this.Board.playingFieldMatrix[y][x] >= 0) return;

        this.makeAMove([y, x], this.currentPlayerToc ?  0 : 1)
    };

    private makeAMove([y, x]: number[], indexShape: number) {
        this.Board.assignCell([y, x], indexShape);
        this.Board.redrawBoard();

        const gameResult = this.checkWin();

        if (Object.keys(gameResult).length) {

        } else {
            this.setNextPlayer();
        }
    }

    private setNextPlayer() {
        this.currentPlayerToc = !this.currentPlayerToc;
    }

    private checkWin() {
        const checkRow = (matrix: number[]): Boolean => matrix.every((el: number) => el === matrix[0]) && matrix[0] !== -1;

        const { playingFieldMatrix } = this.Board; 
        const transposePlayingFieldMatrix = transposeMatrix(this.Board.playingFieldMatrix);

        for (let i = 0; i < playingFieldMatrix.length; i += 1) {
            if (checkRow(playingFieldMatrix[i])) {
                return {
                    winner: playingFieldMatrix[i][0],
                    type: 'row',
                    index: i,
                };
            }
        }

        for (let i = 0; i < transposePlayingFieldMatrix.length; i += 1) {
            if (checkRow(transposePlayingFieldMatrix[i])) {
                return {
                    winner: transposePlayingFieldMatrix[i][0],
                    type: 'col',
                    index: i,
                };
            }
        }

        const diagonalRightDown: number[] = [];
        const diagonalLeftDown: number[] = []

        
        for (let i = 0; i < playingFieldMatrix.length; i +=1) {
            const item = playingFieldMatrix[i]
            diagonalRightDown.push(item[i]);
            diagonalLeftDown.push(item[(item.length - 1) - i]);
        }

        if (checkRow(diagonalRightDown)) {
            return {
                winner: diagonalRightDown[0],
                type: 'rightDown',
            }
        }

        if (checkRow(diagonalLeftDown)) {
            return {
                winner: diagonalLeftDown[0],
                type: 'leftDown'
            }
        }

        return {};
    }
}