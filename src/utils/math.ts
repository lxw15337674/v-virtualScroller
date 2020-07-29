//两个数字排序
export function sort(array: [number, number]): [number, number] {
    return array.sort((a, b) => {
        return a - b;
    });
}

//数组取和
export function total(array: number[], start: number = 0, end: number = -1, key?: string): number {
    if (!array) {
        return 0;
    }
    if (end === -1) {
        end = array.length;
    }
    return array.slice(start, end).reduce((total, item) => {
        if (key) {
            return total + item[key];
        } else {
            return total + item;
        }
    }, 0);
}
//生成随机数
export function random(m, n) {
    return Math.floor(Math.random() * (m - n) + n);
}
