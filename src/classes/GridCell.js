export default class GridCell {
    constructor(dataArray, index) {
        this.dataArray = dataArray;
        this.index = index;
    }

    get sunlight() {
        return this.dataArray[this.index];
    }

    set sunlight(value) {
        this.dataArray[this.index] = value;
    }

    get water() {
        return this.dataArray[this.index + 1];
    }

    set water(value) {
        this.dataArray[this.index + 1] = value;
    }
}