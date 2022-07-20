export const canvas = document.querySelector('#game') as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");
export const startBtn = document.querySelector('#start-new-game-btn') as HTMLCanvasElement;
export const width = canvas.width;
export const height = canvas.height;
export const colors = {
    grid: "rgb(90, 90, 90)",
    tic: '#000',
    tac: '#FF0000',
}
export const lineWidthFigure = 20;