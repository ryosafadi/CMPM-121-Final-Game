import Phaser from 'phaser';
import GridCell from './GridCell.js';

export default class Grid extends Phaser.Events.EventEmitter {
    constructor(scene, rows, cols) {
        super();

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
        this.offsetY = 0; // Align grid to the top

        // Each cell requires 2 bytes: 1 for sunlight, 1 for water
        this.dataArray = new Uint8Array(rows * cols * 2);

        // Create a wrapper for each cell
        this.gridCells = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = (row * cols + col) * 2; // Calculate the byte offset
                const cell = new GridCell(this.dataArray, index)
                cell.sunlight = Phaser.Math.Between(0, 10) // Random sunlight level
                cell.water = Phaser.Math.Between(0, 5) // Random water level
                this.gridCells.push(cell)
            }
        }

        // Initialize plants array
        this.plants = [];
    }

    getCell(row, col) {
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            const index = row * this.cols + col;
            return this.gridCells[index];
        }
        return null; // Return null if the row or col is out of bounds
    }

    addPlant(row, col, plant) {
        const cell = this.getCell(row, col);
        if (!cell.plants) {
            cell.plants = [];
        }
        cell.plants.push(plant);
        this.plants.push({ row, col, plant });
    }
    
    removePlant(row, col, plant) {
        const cell = this.getCell(row, col);
        if (cell && cell.plants) {
            cell.plants = cell.plants.filter(p => p !== plant);
        }
        this.plants = this.plants.filter(p => p.row !== row || p.col !== col || p.plant !== plant);
    }

    checkGrowthConditions() {
        this.plants.forEach(({ row, col, plant }) => {
            const cell = this.getCell(row, col);
            const sunlight = cell.sunlight;
            const water = cell.water;
            const nearbyPlants = this.getNearbyPlants(row, col);
            plant.grow(sunlight, water, nearbyPlants);
        });
    }

    getNearbyPlants(row, col) {
        const nearbyPlants = [];
        const directions = [
            { dr: -1, dc: 0 }, { dr: 1, dc: 0 },
            { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
        ];
        directions.forEach(({ dr, dc }) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
                const cell = this.getCell(newRow, newCol);
                if (cell && cell.plants) {
                    cell.plants.forEach(plant => {
                        nearbyPlants.push(plant);
                    });
                }
            }
        });
        return nearbyPlants;
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
            }
        }
    }

}