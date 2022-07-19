const canvas = document.querySelector('#game') as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const startBtn = document.querySelector('#start-new-game-btn') as HTMLCanvasElement;
const width = canvas.width;
const height = canvas.height;
const colors = {
    grid: "rgb(90, 90, 90)",
    tic: '#000',
    tac: '#FF0000',
}

const lineWidthFigure = 20;

type DrawAFigure = (array: number[]) => void;

export class Board {
    public playingFieldMatrix: number[][];
    public tile_size: number = 0;
    public tiles_x: number = 0;
    public tiles_y: number = 0;
    // TODO: Необходимо проверить можно ли так делать
    private lastMove: [number, number];
    // private lastCell: number;

    public assignDimensions(sizeMatrices: number): void {
        this.tile_size = width / sizeMatrices;
        this.tiles_x = width / this.tile_size;
        this.tiles_y = height / this.tile_size; 


        this.drawCells();
        this.createAPlayingFieldMatrix();
    }

    public assignCell([y, x]: number[], indexShape: number): void {
        this.playingFieldMatrix[y][x] = indexShape
        this.lastMove = [y, x];
    }

    public redrawBoard() {
        this.drawShapesOnTheBoard(true);
    }

    private drawCells() {
        ctx.strokeStyle = colors.grid; 
        ctx.lineWidth = 0.5;

        for (let i = 1; i < this.tiles_x; i++) {
            ctx.beginPath();
            ctx.moveTo(i * this.tile_size, 0);
            ctx.lineTo(i * this.tile_size, height);
            ctx.stroke();
        }

        for (let i = 1; i < this.tiles_x; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * this.tile_size - 0.5);
            ctx.lineTo(width, i * this.tile_size - 0.5);
            ctx.stroke()
        }
    }

    private createAPlayingFieldMatrix() {
        this.playingFieldMatrix = [];
        for (let i = 0; i < this.tiles_x; i += 1) {
            const row = [];
            for (let j = 0; j < this.tiles_y; j += 1) {
                row.push(0);
            }
            this.playingFieldMatrix.push(row);
        }
    }

    private drawShapesOnTheBoard(animateTheLast: Boolean = false): void {
        for (let i = 0; i < this.playingFieldMatrix.length; i += 1 ) {
            const row = this.playingFieldMatrix[i];
            for (let j = 0; j < row.length; j += 1) {
                if (row[j] >= 0) {
                    [this.drawTic, this.drawToc][row[j]]([j, i]);
                }
            }
        }
    }

    private drawTic: DrawAFigure = ([x, y]) => {
        const lineWidthCircle = lineWidthFigure;
        ctx.strokeStyle = colors.tic; 
        const padding = 30;
        x += 1;
        y += 1;
        ctx.beginPath();
        const radius = this.tile_size / 2; 
        const coordsX = radius * (2 * x - 1);
        const coordsY = radius * (2 * y - 1);
        ctx.arc(coordsX, coordsY, (radius - lineWidthCircle / 2) - padding, 0, Math.PI * 3);
        ctx.lineWidth = lineWidthCircle;
        ctx.stroke();
    }
    
    private drawToc: DrawAFigure = ([x, y]) => {
        ctx.strokeStyle = colors.tac; 
        const padding = 30;
        ctx.lineWidth = lineWidthFigure;
        ctx.beginPath();
        ctx.moveTo(this.tile_size * x + padding, this.tile_size * y + padding);
        ctx.lineTo(this.tile_size * (x + 1) - padding, this.tile_size * (y + 1) - padding);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.tile_size * (x + 1) - padding, this.tile_size * y + padding);
        ctx.lineTo(this.tile_size * x + padding, this.tile_size * (y + 1) - padding);
        ctx.stroke();
    }
}