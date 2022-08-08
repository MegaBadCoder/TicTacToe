export type Figure = 1 | -1 | 0; 
export type DrawAFigure = {
    // (array: number[], ): void;
    (array: number[], animate?: boolean) : void;
}