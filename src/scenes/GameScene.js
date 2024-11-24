import Grid from '../classes/Grid.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    init() {
        this.ROWS = 3;
        this.COLS = 3;
    }

    create() {
        const grid = new Grid(this, this.ROWS, this.COLS);

        grid.drawGrid(this);
    }
}

