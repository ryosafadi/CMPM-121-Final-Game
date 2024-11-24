import GridCell from './GridCell.js';

export default class Grid {
    constructor(scene, rows, cols) {
        this.scene = scene;
        this.rows = rows;
        this.cols = cols;

        // Calculate cell size based on window dimensions
        this.cellWidth = Math.floor(this.scene.scale.width / this.cols);
        this.cellHeight = Math.floor(this.scene.scale.height / this.rows);
        this.cellSize = Math.min(this.cellWidth, this.cellHeight); // Ensures square cells

        // Calculate the total width and height of the grid
        this.gridWidth = this.cols * this.cellSize;
        this.gridHeight = this.rows * this.cellSize;

        // Calculate the offset to center the grid
        this.offsetX = (this.scene.scale.width - this.gridWidth) / 2;
        this.offsetY = (this.scene.scale.height - this.gridHeight) / 2;

        // Each cell requires 2 bytes: 1 for sunlight, 1 for water
        this.dataArray = new Uint8Array(rows * cols * 2);

        // Create a wrapper for each cell
        this.gridCells = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = (row * cols + col) * 2; // Calculate the byte offset
                this.gridCells.push(new GridCell(this.dataArray, index));
            }
        }
    }

    getCell(row, col) {
        const index = row * this.cols + col;
        return this.gridCells[index];
    }

    drawGrid(scene) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = this.offsetX + col * this.cellSize + this.cellSize / 2;
                const y = this.offsetY + row * this.cellSize + this.cellSize / 2;

                // Draw the cell rectangle
                const rect = scene.add.rectangle(
                    x, y,
                    this.cellSize - 2, this.cellSize - 2,
                    0x000000,
                    0.1
                );
                rect.setStrokeStyle(2, 0xffffff);

                // Access the corresponding cell
                const cell = this.getCell(row, col);
            }
        }
    }
}