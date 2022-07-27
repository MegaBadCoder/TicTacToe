import { Board } from './Board';
import { transposeMatrix } from './helpers';
import { canvas, ctx, startBtn, width, height } from './constants';

export class Game {
    public currentPlayerToc: Boolean = true;
    private Board = new Board();
    public gameStatus: number = 0;
    readonly gameStatusNames: string[] = ['process', 'finished', 'frozen'];
    readonly sizeMatrices: number[] = [3, 5, 7];
    public winner: number = -1;

    public initGame() {
        this.Board.assignDimensions(this.sizeMatrices[1]);
        canvas.addEventListener('click', this.clickOnBoard.bind(this));
        startBtn.addEventListener('click', this.startNewGame.bind(this));
    }

    private startNewGame() {
        ctx.clearRect(0, 0, width, height);
        this.gameStatus = 0;
        this.currentPlayerToc = true;
        this.Board.assignDimensions(this.sizeMatrices[0]);
    }

    private clickOnBoard(e: Event) {
        const x = Math.floor((e.clientX - canvas.offsetLeft) / this.Board.tile_size);
        const y = Math.floor((e.clientY - canvas.offsetTop) / this.Board.tile_size);
        
        if ([3,2].includes(this.gameStatus) || this.Board.playingFieldMatrix[y][x] >= 0 || this.Board.drawingProcess) return;

        this.makeAMove([y, x], this.currentPlayerToc ?  0 : 1)
    };

    private async makeAMove([y, x]: number[], indexShape: number) {
        this.Board.assignCell([y, x], indexShape);
        this.Board.redrawBoard();

        const interval = setInterval(async () => {
            if (this.Board.drawingProcess) return;
            

            const gameResult = this.checkWin();
            const { winner, type, index } = gameResult

            if (!Object.keys(gameResult).length) {
                this.setNextPlayer();
            } else if (winner !== undefined) {
                this.gameStatus = 2;
                await this.Board.crossOutTheLine(type, index);
            }
            
            clearInterval(interval);
        })

        
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