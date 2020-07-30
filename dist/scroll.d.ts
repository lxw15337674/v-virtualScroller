interface VisiblePosition {
    start: number;
    end: number;
}
export declare function findVisibleIndex(offset: number, visibleOffset: number, list: number[]): VisiblePosition;
export {};
