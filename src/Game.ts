import { Board } from './Board';
import { Modal } from './modal'
import { transposeMatrix } from './helpers';
import { canvas, ctx, startBtn, width, height, introBlockClassName } from './constants';
import { Figure } from './types';

export class Game {
    public currentPlayerToc: Boolean = true;
    private Board = new Board();
    public gameStatus: number = 0;
    readonly gameStatusNames: string[] = ['process', 'finished', 'frozen'];
    readonly sizeMatrices: number[] = [3, 5];
    private introModal = new Modal(this.generateIntro())
    public winner: number = -1;

    public initGame() {
        this.introModal.showModal();

        canvas.addEventListener('click', this.clickOnBoard.bind(this));
        startBtn.addEventListener('click', this.startNewGame.bind(this));
    }

    private startNewGame() {
        ctx.clearRect(0, 0, width, height);
        this.gameStatus = 0;
        this.currentPlayerToc = true;

        this.introModal.showModal();
        this.showHideStartBtn();
    }

    private clickOnBoard(e) {
        const x = Math.floor((e.clientX - canvas.offsetLeft) / this.Board.tile_size);
        const y = Math.floor((e.clientY - canvas.offsetTop) / this.Board.tile_size);

        if ([3,2].includes(this.gameStatus) || this.Board.playingFieldMatrix[y][x] >= 0 || this.Board.drawingProcess) return;

        this.makeAMove([y, x], this.currentPlayerToc ?  0 : 1)
    };

    private async makeAMove([y, x]: number[], indexShape: Figure) {
        this.Board.assignCell([y, x], indexShape);
        this.Board.redrawBoard();

        const gameResult = this.checkWin();
        const { winner, type, index } = gameResult
        
        this.setNextPlayer();
        await this.checkDrawingProcess();

        if (winner !== undefined && winner !== -1) {
            this.gameStatus = 2;
            await this.Board.crossOutTheLine(String(type), index);
            this.showWinner(winner);
        } else if (winner === -1){
            this.showWinner(winner);
        }
    }

    private checkDrawingProcess() {
        return new Promise<void>(resolve => {
            const interval = setInterval(() => {
                if (!this.Board.drawingProcess) {
                    clearInterval(interval);
                    resolve();
                };
            }, 10);  
        })
    } 
    private setNextPlayer() {
        this.currentPlayerToc = !this.currentPlayerToc;
    }

    private checkWin(): { winner?: Figure, type?: string, index?: number  } {
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

        const diagonalRightDown: Figure[] = [];
        const diagonalLeftDown: Figure[] = []

        
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

        for (let i = 0; i < playingFieldMatrix.length; i += 1) {
            for (let j = 0; j < playingFieldMatrix[i].length; j += 1) {
                if (playingFieldMatrix[i][j] === -1) {
                    return {};
                }
            }
        }

        return { winner: -1 }

    }

    private generateIntro() {
        const mainBlockClassName = introBlockClassName;
        const introBlock = document.createElement('div');
        const header = document.createElement('h2');
        
        introBlock.className = mainBlockClassName;
        header.textContent = 'Choose the size of the matrix'; 
        header.className = `${mainBlockClassName}__header`
        const elements: HTMLElement[] = this.sizeMatrices.map((item, i) => {
            const button = document.createElement('button');
            button.classList.add(`${mainBlockClassName}__btn`);
            button.textContent = `${item}X${item}`
            button.dataset.id = String(i);
            button.onclick = this.clickStartBtn.bind(this);
            return button;
        })

        elements.unshift(header);

        elements.forEach(el => introBlock.appendChild(el));
        return introBlock;
    }

    private clickStartBtn(e) {
        const sizeMatrices = this.sizeMatrices[Number(e.target.dataset.id)];
        this.Board.assignDimensions(sizeMatrices);
        
        this.introModal.removeModal();
        this.showHideStartBtn();
    }
    
    private showHideStartBtn() {
        startBtn.classList.toggle("hide");
    }

    private showWinner(winner: Figure) {
        const introBlock = document.createElement('div');
        introBlock.className = introBlockClassName;
        const winnerTmpl = (word: string) => `Winner: ${word}`;
        const winnerName = winner === -1 ? 'Dead heat' : winnerTmpl(['Toe', 'Tic Tac'][winner]);
        
        const header = document.createElement('h2');
        const btn = document.createElement('button');
        btn.classList.add(`${introBlockClassName}__btn`);
        btn.textContent = 'START OVER';
        btn.onclick = () => {
            modal.removeModal();
            this.startNewGame();
        }

        const modal = new Modal(introBlock);
        header.textContent = winnerName;
        
        [header, btn].forEach(_ => {
            introBlock.appendChild(_);
        })
   
        modal.showModal();
    }
}