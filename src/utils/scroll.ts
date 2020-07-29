// 二分查找法
function binarySearch(offset: number, list: number[]): number {
    if (list.length === 0) {
        // console.error('数组为空');
        return 0;
    }
    let startIndex = 0,
        endIndex = list.length - 1,
        midIndex,
        startOffset,
        endOffset;
    while (startIndex <= endIndex) {
        midIndex = Math.floor((startIndex + endIndex) / 2);
        startOffset = list[midIndex - 1] || 0;
        endOffset = list[midIndex];
        //处理索引为0的情况
        if (midIndex === 0 && offset <= list[0]) {
            return 0;
        }
        if (startOffset > offset) {
            endIndex = midIndex - 1;
        } else if (startOffset === offset) {
            return midIndex - 1;
        } else if (startOffset <= offset && offset <= endOffset) {
            return midIndex;
        } else if (endOffset < offset) {
            startIndex = midIndex + 1;
        }
    }
    return list.length;
}
// 获取当前表格的索引值，例如{start:0,end:10}
interface VisiblePosition {
    start: number;
    end: number;
}
export function findVisibleIndex(
    offset: number,
    visibleOffset: number,
    list: number[],
): VisiblePosition {
    let start = binarySearch(offset, list);
    let end = binarySearch(visibleOffset + offset, list);
    return {
        start: start,
        end: end,
    };
}
