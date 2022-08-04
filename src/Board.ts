import { animate, circ, easeOutQuart, easeOutCubic } from "./animate";
import { ctx, width, height, colors, lineWidthFigure } from './constants';

type DrawAFigure = {
    // (array: number[], ): void;
    (array: number[], animate?: boolean) : void;
}
type Figure = 1 | -1 | 0; 

export class Board {
    // TODO Второй тип в матрицах должен быть не номером, а фигурой
    public playingFieldMatrix: Figure[][] = [];
    public tile_size: number = 0;
    public tiles_x: number = 0;
    public tiles_y: number = 0;
    public drawingProcess = false;
    // TODO: Необходимо проверить можно ли так делать
    private lastMove: [number, number] = [-1, -1];
    readonly timeAnimationCross = 300;

    public assignDimensions(sizeMatrices: number): void {
        this.tile_size = width / sizeMatrices;
        this.tiles_x = width / this.tile_size;
        this.tiles_y = height / this.tile_size; 
        this.drawCells();
        this.createAPlayingFieldMatrix();
    }

    public assignCell([y, x]: number[], indexShape: Figure): void {
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
        const [lastMoveY, lastMoveX] = this.lastMove;

        for (let i = 0; i < this.playingFieldMatrix.length; i += 1 ) {
            const row = this.playingFieldMatrix[i];
            for (let j = 0; j < row.length; j += 1) {
                if (animateTheLast && lastMoveY === i && lastMoveX === j) {
                    break;
                }
                if (row[j] >= 0) {
                    [this.drawTic, this.drawToc][row[j]]([j, i]);
                }
            }
        }

        if (animateTheLast) {
            [this.drawTic, this.drawToc][this.playingFieldMatrix[lastMoveY][lastMoveX]]([lastMoveX, lastMoveY], true);
        }
    }

    private drawTic: DrawAFigure = ([x, y], animation) => {
        const lineWidthCircle = lineWidthFigure;
        ctx.strokeStyle = colors.tic; 
        const padding = 30;
        x += 1;
        y += 1;
        const radius = this.tile_size / 2; 
        const coordsX = radius * (2 * x - 1);
        const coordsY = radius * (2 * y - 1);
        ctx.lineWidth = lineWidthCircle;

        const draw = (completeness: number): void => {
            ctx.beginPath();
            ctx.arc(
                coordsX, coordsY, 
                (radius - lineWidthCircle / 2) - padding, 0, 
                Math.PI * 2 * completeness);
            ctx.stroke();
        }

        if (animation) {
            this.drawingProcess = true;

            animate({
                duration: 400,
                timing: (tf: number) => {
                    // TODO: It's a crutch that needs to be fixed;

                    if (tf === 1) this.drawingProcess = false;
                    return easeOutQuart(tf);
                },
                draw: (progress: number): void => {
                    draw(progress);
                    this.drawingProcess = progress !== 1
                },
            })
        } else {
            draw(1);
        }
    }
    
    private drawToc: DrawAFigure = ([x, y], animation) => {
        const draw = (starCoords: number[], finCoords: number[]): void => {
            ctx.beginPath();
            ctx.moveTo(starCoords[0], starCoords[1]);
            ctx.lineTo(finCoords[0], finCoords[1]);
            ctx.stroke();
        }
        
        ctx.strokeStyle = colors.tac; 
        const padding = 30;
        ctx.lineWidth = lineWidthFigure;

        const startX = this.tile_size * x + padding; 
        const startY = this.tile_size * y + padding;
        const finY = this.tile_size * (y + 1) - padding;
        const startX2 = this.tile_size * (x + 1) - padding;

        if (animation) {
            this.drawingProcess = true;
            animate({
                duration: 400,
                timing: (tf: number) => {
                    // TODO: It's a crutch that needs to be fixed;
                    if (tf === 1) this.drawingProcess = false;
                    return easeOutQuart(tf);
                },
                draw: (progress: number): void => {
                    const diffXY = this.tile_size - 2 * padding;
                    const progressY = startY + diffXY * progress;
                    const progressX1 = startX + diffXY * progress;
                    const progressX2 = startX2 - diffXY * progress

                    ctx.clearRect(
                        this.tile_size * x + 2,
                        this.tile_size * y + 2, 
                        this.tile_size - 3, 
                        this.tile_size - 3
                    );
                    draw([startX, startY], [progressX1, progressY]);
                    draw([startX2, startY], [progressX2, progressY]);
                },
            })
        } else {
            draw([startX, startY], [startX2, finY])
            draw([startX2, startY], [startX, finY])
        }
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
            timing: easeOutCubic,
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