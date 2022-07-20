import { animate, circ } from "./animate";
import { ctx, width, height, colors, lineWidthFigure } from './constants';

type DrawAFigure = (array: number[]) => void;

export class Board {
    // TODO Второй тип в матрицах должен быть не номером, а фигурой
    public playingFieldMatrix: number[][] = [];
    public tile_size: number = 0;
    public tiles_x: number = 0;
    public tiles_y: number = 0;
    // TODO: Необходимо проверить можно ли так делать
    private lastMove: [number, number];
    readonly timeAnimationCross = 500;

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

    public async crossOutTheLine(type: string, line: number | undefined) {
        const actions = {
            row: async () => {
                await this.crossOutRow(Number(line));
            },
            col: async () => {
                await this.crossOutCol(Number(line));
            },
            rightDown: async () => {
                await this.crossOutDiagonally(true);
            },
            leftDown: async () => {
                await this.crossOutDiagonally();
            }
        }
        
        if (type in actions) await actions[type]();
        
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
                row.push(-1);
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

    private async crossOutRow(indexCol: number) {
        const y = indexCol * this.tile_size + this.tile_size / 2
        ctx.strokeStyle = colors.grid; 
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(0, y - 0.5);
        await animate({
            duration: this.timeAnimationCross,
            timing: circ,
            draw: (progress: number): void => {
                ctx.lineTo(width * progress, y - 0.5);
                ctx.stroke()
            },
        });
    }

    private async crossOutCol(indexCol: number) {
        const x = indexCol * this.tile_size + this.tile_size / 2
        ctx.strokeStyle = colors.grid; 
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x, 0);
    
        await animate({
            duration: this.timeAnimationCross,
            timing: circ,
            draw: (progress: number): void => {
                ctx.lineTo(x, height * progress);
                ctx.stroke();
            },
        })
    } 

    private async crossOutDiagonally(leftDown: Boolean = false) {
        const startCoords: number[] = leftDown ? [0, 0] : [width, 0];
        const endCoords: number[] = leftDown ? [width, height] : [0, height];
        ctx.strokeStyle = colors.grid; 
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(startCoords[0], startCoords[1]);

        await animate({
            duration: this.timeAnimationCross,
            timing: circ,
            draw: (progress: number): void => {
                const x = leftDown ? endCoords[0] * progress : width - width * progress;
                const y =    endCoords[1] * progress
                ctx.lineTo(x, y);
                ctx.stroke();
            },
        });   
    }
}