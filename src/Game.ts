const canvas = document.querySelector('#game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector('#start-new-game-btn') as HTMLCanvasElement;
const width = canvas.width;
const height = canvas.height;
const TILE_SIZE = width / 3;
const TILES_X = width / TILE_SIZE;
const TILES_Y = height / TILE_SIZE;

export class Game {
    public playingFieldMatrix: number[][];
    public currentPlayerToc: Boolean;
    public gameStatus: number;
    public tile_size: number;
    public tiles_x: number;
    public tiles_y: number;
    private sizeMatrices: number[] = [3, 5, 7];
    public winner: number;

    private assignDimensions(indexMatrixSize) {
        this.tile_size = width / this.sizeMatrices[indexMatrixSize];
        this.tiles_x = width / this.tile_size;
        this.tiles_y = height / this.tile_size; 
    }

    private startNewGame() {

    }

    private createAPlayingFieldMatrix() {
        this.playingFieldMatrix = [];
        for (let i = 0; i < TILES_X; i += 1) {
            const row = [];
            for (let j = 0; j < TILES_Y; j += 1) {
                row.push(-1);
            }
            this.playingFieldMatrix.push(row);
        }
    }
}