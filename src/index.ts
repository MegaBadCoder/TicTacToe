import { animate, circ } from './animate';
import { transposeMatrix } from './helpers';
import { Game } from './Game';

// const canvas = document.querySelector('#game') as HTMLCanvasElement;
// const startBtn = document.querySelector('#start-new-game-btn') as HTMLCanvasElement;
// const width = canvas.width;
// const height = canvas.height;
// const ctx = canvas.getContext("2d");
// const TILE_SIZE = width / 3;
// const TILES_X = width / TILE_SIZE;
// const TILES_Y = height / TILE_SIZE;
// const timeAnimationCross = 500;
// const figures = ['Нолики', 'Крестики'];
// const colors = {
//     grid: "rgb(90, 90, 90)",
//     tic: '#000',
//     tac: '#FF0000',
// }

// const gameStatuses: string[] = ['startMenu', 'progress', 'finised']
// const lineWidthCircle = 20;
// let gameStatus = 1;
// let playingFieldMatrix: number[][] = [];
// let currentPlayerToc: Boolean = true;

// ctx.fillStyle = "#000";

// const startNewGame = () => {
//     ctx.clearRect(0, 0, width, height);
//     drawBorders();
//     createAPlayingFieldMatrix();
//     gameStatus = 1;
//     currentPlayerToc = true;
// }

// const drawBorders = () => {
//     ctx.strokeStyle = colors.grid; 
//     ctx.lineWidth = 0.5;

//     for (let i = 1; i < TILES_X; i++) {
//         ctx.beginPath();
//         ctx.moveTo(i * TILE_SIZE, 0);
//         ctx.lineTo(i * TILE_SIZE, height);
//         ctx.stroke();
//     }

//     for (let i = 1; i < TILES_Y; i++) {
//         ctx.beginPath();
//         ctx.moveTo(0, i * TILE_SIZE - 0.5);
//         ctx.lineTo(width, i * TILE_SIZE - 0.5);
//         ctx.stroke()
//     }
// }

// canvas.addEventListener("click", e => {
//     if (gameStatus === 2) {
//         return;
//     }

//     const x = Math.floor((e.clientX - canvas.offsetLeft) / TILE_SIZE);
//     const y = Math.floor((e.clientY - canvas.offsetTop) / TILE_SIZE);

//     if (playingFieldMatrix[y][x] !== -1) {
//         return;
//     }

//     playingFieldMatrix[y][x] = currentPlayerToc ?  0 : 1;
//     setNextPlayer();

//     drawTheField();
    
//     const resultGame = winCheck();

//     if (typeof resultGame === 'object') { 
//         const { winner, type, index } = resultGame;
//         const actionsTypes = {
//             row: () => {
//                 crossOutRow(index);
//             },
//             col: () => {
//                 crossOutCol(index);
//             },
//             rightDown: () => {
//                 crossOutDiagonally(true);
//             },
//             leftDown: () => {
//                 crossOutDiagonally();
//             }
//         }
//         type in actionsTypes && actionsTypes[type]();
//         gameStatus = 2;
//         setTimeout(() => {
//             showWinner(winner);
//             // console.log('Выиграали 0')
//         }, timeAnimationCross);
//     }
// })

// startBtn.addEventListener("click", (e) => {
//     startNewGame();
// });

// const showWinner = (winnerIndex) => {
//     console.log(winnerIndex, figures[winnerIndex]);
// }

// const drawTheField = () => {
//     for (let i = 0; i < playingFieldMatrix.length; i += 1 ) {
//         const row = playingFieldMatrix[i];
//         for (let j = 0; j < row.length; j += 1) {
//             if (row[j] >= 0) {
//                 [drawTic, drawToc][row[j]]([j, i]);
//             }
//         }
//     }
// }

// const checkRow = (matrix: number[]): Boolean => matrix.every((el: number) => el === matrix[0]) && matrix[0] !== -1;

// const winCheck = () => {
//     const transposePlayingFieldMatrix = transposeMatrix(playingFieldMatrix);
//     for (let i = 0; i < playingFieldMatrix.length; i += 1) {
//         if (checkRow(playingFieldMatrix[i])) {
//             return {
//                 winner: playingFieldMatrix[i][0],
//                 type: 'row',
//                 index: i,
//             };
//         }
//     }

//     for (let i = 0; i < transposePlayingFieldMatrix.length; i += 1) {
//         if (checkRow(transposePlayingFieldMatrix[i])) {
//             return {
//                 winner: transposePlayingFieldMatrix[i][0],
//                 type: 'col',
//                 index: i,
//             };
//         }
//     }

//     const diagonalRightDown: number[] = [];
//     const diagonalLeftDown: number[] = []
    
//     for (let i = 0; i < playingFieldMatrix.length; i +=1) {
//         const item = playingFieldMatrix[i]
//         diagonalRightDown.push(item[i]);
//         diagonalLeftDown.push(item[(item.length - 1) - i]);
//     }

//     if (checkRow(diagonalRightDown)) {
//         return {
//             winner: diagonalRightDown[0],
//             type: 'rightDown',
//         }
//     }

//     if (checkRow(diagonalLeftDown)) {
//         return {
//             winner: diagonalLeftDown[0],
//             type: 'leftDown'
//         }
//     }

//     return false;
// }

// drawBorders();

// const createAPlayingFieldMatrix = () => {
//     playingFieldMatrix = [];
//     for (let i = 0; i < TILES_X; i += 1) {
//         const row = [];
//         for (let j = 0; j < TILES_Y; j += 1) {
//             row.push(-1);
//         }
//         playingFieldMatrix.push(row);
//     }
// }

// const setNextPlayer = () => {
//     currentPlayerToc = !currentPlayerToc;
// }

// type DrawAFigure = (array: number[]) => void;

// const crossOutCol = async (indexCol) => {
//     const x = indexCol * TILE_SIZE + TILE_SIZE / 2
//     ctx.strokeStyle = colors.grid; 
//     ctx.lineWidth = 10;
//     ctx.beginPath();
//     ctx.moveTo(x, 0);

//     await animate({
//         duration: timeAnimationCross,
//         timing: circ,
//         draw: (progress: number): void => {
//             ctx.lineTo(x, height * progress);
//             ctx.stroke();
//         },
//     })
// }



// const crossOutRow = async (indexCol) => {
//     const y = indexCol * TILE_SIZE + TILE_SIZE / 2
//     ctx.strokeStyle = colors.grid; 
//     ctx.lineWidth = 10;
//     ctx.beginPath();
//     ctx.moveTo(0, y - 0.5);
//     await animate({
//         duration: timeAnimationCross,
//         timing: circ,
//         draw: (progress: number): void => {
//             ctx.lineTo(width * progress, y - 0.5);
//             ctx.stroke()
//         },
//     });
// }

// const crossOutDiagonally = async (leftDown: Boolean = false) => {
//     const startCoords: number[] = leftDown ? [0, 0] : [width, 0];
//     const endCoords: number[] = leftDown ? [width, height] : [0, height];
//     ctx.strokeStyle = colors.grid; 
//     ctx.lineWidth = 10;
//     ctx.beginPath();
//     ctx.moveTo(startCoords[0], startCoords[1]);
//     await animate({
//         duration: timeAnimationCross,
//         timing: circ,
//         draw: (progress: number): void => {
//             const x = leftDown ? endCoords[0] * progress : width - width * progress;
//             const y =    endCoords[1] * progress
//             ctx.lineTo(x, y);
//             ctx.stroke();
//         },
//     });   
// }

// const drawTic: DrawAFigure = ([x, y]) => {
//     ctx.strokeStyle = colors.tic; 
//     const padding = 30;
//     x += 1;
//     y += 1;
//     ctx.beginPath();
//     const radius = TILE_SIZE / 2; 
//     const coordsX = radius * (2 * x - 1);
//     const coordsY = radius * (2 * y - 1);
//     ctx.arc(coordsX, coordsY, (radius - lineWidthCircle / 2) - padding, 0, Math.PI * 3);
//     ctx.lineWidth = lineWidthCircle;
//     ctx.stroke();
// }

// const drawToc: DrawAFigure = ([x, y]) => {
//     ctx.strokeStyle = colors.tac; 
//     const padding = 30;
//     ctx.lineWidth = lineWidthCircle;
//     ctx.beginPath();
//     ctx.moveTo(TILE_SIZE * x + padding, TILE_SIZE * y + padding);
//     ctx.lineTo(TILE_SIZE * (x + 1) - padding, TILE_SIZE * (y + 1) - padding);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(TILE_SIZE * (x + 1) - padding, TILE_SIZE * y + padding);
//     ctx.lineTo(TILE_SIZE * x + padding, TILE_SIZE * (y + 1) - padding);
//     ctx.stroke();
// }

// createAPlayingFieldMatrix();
(function main(): void {
    let game: Game = new Game();
    game.initGame();
})();