import { Board } from './Board';

export class Game {
    public currentPlayerToc: Boolean = true;
    private Board = new Board();
    public gameStatus: number = 0;
   
    readonly sizeMatrices: number[] = [3, 5, 7];
    public winner: number = -1;

    public startNewGame() {
        this.Board.assignDimensions(this.sizeMatrices[0]);
    }

    // private

    private setNextPlayer = () => {
        this.currentPlayerToc = !this.currentPlayerToc;
    }

    
}