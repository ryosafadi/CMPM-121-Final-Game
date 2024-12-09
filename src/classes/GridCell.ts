export default class GridCell {
    private dataArray: number[];
    private index: number;

    constructor(dataArray: number[], index: number) {
        this.dataArray = dataArray;
        this.index = index;
    }

    get sunlight(): number {
        return this.dataArray[this.index];
    }

    set sunlight(value: number) {
        this.dataArray[this.index] = value;
    }

    get water(): number {
        return this.dataArray[this.index + 1];
    }

    set water(value: number) {
        this.dataArray[this.index + 1] = value;
    }
}