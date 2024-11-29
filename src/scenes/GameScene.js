// FILE: src/scenes/GameScene.js
import Grid from '../classes/Grid.js';
import Plant from '../classes/Plant.js';
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.inventory = [];
        this.selectedPlant = null;
    }

    init() {
        this.ROWS = 3;
        this.COLS = 3;
    }

    create() {
        const grid = new Grid(this, this.ROWS, this.COLS);
        grid.drawGrid(this);

        // Create boxes and add plants
        this.createBoxes(grid);

        this.player = new Player(this, grid, 1, 1, "player");

        // Add interactivity to the grid for placing plants
        this.input.on('pointerdown', (pointer) => {
            const x = pointer.x;
            const y = pointer.y;
            this.handleGridClick(grid, x, y);
        });

        // Create inventory display
        this.createInventoryDisplay();
    }

    update() {
        this.player.update();
    }

    createBoxes(grid) {
        const plantTypes = ['🌱', '🌿', '🌳'];
        this.boxes = [
            { row: 0, col: 0, plants: [new Plant(plantTypes[0], 1)] },
            { row: 0, col: 1, plants: [new Plant(plantTypes[1], 1)] },
            { row: 0, col: 2, plants: [new Plant(plantTypes[2], 1)] }
        ];

        this.boxes.forEach(box => {
            box.plants.forEach(plant => {
                grid.addPlant(box.row, box.col, plant);
            });
        });

        // Draw boxes with different colors and add interactivity
        this.drawBoxes(grid, this.boxes);

        // Check growth conditions periodically
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                grid.checkGrowthConditions();
                this.drawPlants(grid);
            },
            loop: true
        });

        // Initial draw of plants
        this.drawPlants(grid);
    }

    drawBoxes(grid, boxes) {
        boxes.forEach(box => {
            const x = grid.offsetX + box.col * grid.cellSize;
            const y = grid.offsetY + box.row * grid.cellSize;
            const rect = this.add.rectangle(x, y, grid.cellSize, grid.cellSize, 0xff0000).setOrigin(0);
            rect.setInteractive();
            rect.on('pointerdown', () => this.handleBoxClick(box));
            const text = this.add.text(x + grid.cellSize / 2, y + grid.cellSize / 2, '📦', {
                fontSize: `${grid.cellSize / 2}px`,
                align: 'center'
            }).setOrigin(0.5);
        });
    }

    drawPlants(grid) {
        grid.plants.forEach(({ row, col, plant }) => {
            const x = grid.offsetX + col * grid.cellSize + grid.cellSize / 2;
            const y = grid.offsetY + row * grid.cellSize + grid.cellSize / 2;
            const text = this.add.text(x, y, plant.type, {
                fontSize: `${grid.cellSize / 3}px`, // Smaller font size for plant emoji
                align: 'center'
            }).setOrigin(0.5);
        });
    }

    handleBoxClick(box) {
        if (this.selectedPlant) {
            // Return plant to the box
            box.plants.push(this.selectedPlant);
            this.inventory = this.inventory.filter(plant => plant !== this.selectedPlant);
            this.selectedPlant = null;
            this.updateInventoryDisplay();
            alert(`Returned: ${box.plants[box.plants.length - 1].type} (Level ${box.plants[box.plants.length - 1].level}) to the box`);
        } else {
            // Pick up plant from the box
            this.pickUpPlant(box.plants);
        }
    }

    pickUpPlant(plants) {
        if (plants.length > 0) {
            const plant = plants.pop();
            this.inventory.push(plant);
            this.selectedPlant = plant;
            this.updateInventoryDisplay();
            alert(`Picked up: ${plant.type} (Level ${plant.level})`);
        }
    }

    handleGridClick(grid, x, y) {
        const col = Math.floor((x - grid.offsetX) / grid.cellSize);
        const row = Math.floor((y - grid.offsetY) / grid.cellSize);

        if (row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS) {
            const cell = grid.getCell(row, col);
            if (!cell.plant) {
                // Place plant from inventory
                if (!this.isBox(row, col)) {
                    this.showPlantSelectionMenu(grid, row, col);
                }
            }
        }
    }

    isBox(row, col) {
        return this.boxes.some(box => box.row === row && box.col === col);
    }

    showPlantSelectionMenu(grid, row, col) {
        if (this.inventory.length > 0) {
            const plantCounts = this.inventory.reduce((counts, plant) => {
                counts[plant.type] = (counts[plant.type] || 0) + 1;
                return counts;
            }, {});

            // Create a menu with buttons for each plant type
            const menu = this.add.container(grid.offsetX + col * grid.cellSize, grid.offsetY + row * grid.cellSize);
            let y = 0;

            for (const [type, count] of Object.entries(plantCounts)) {
                const button = this.add.text(0, y, `${type} (${count})`, {
                    fontSize: '20px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setInteractive();

                button.on('pointerdown', () => {
                    const selectedPlant = this.inventory.find(plant => plant.type === type);
                    if (selectedPlant) {
                        grid.addPlant(row, col, selectedPlant);
                        this.inventory = this.inventory.filter(plant => plant !== selectedPlant);
                        this.selectedPlant = null;
                        this.drawPlants(grid);
                        this.updateInventoryDisplay();
                        menu.destroy();
                    }
                });

                menu.add(button);
                y += 30;
            }
        } else {
            alert('No plants in inventory');
        }
    }

    returnPlantToBox(plant) {
        this.inventory.push(plant);
        this.updateInventoryDisplay();
        alert(`Returned: ${plant.type} (Level ${plant.level}) to the box`);
    }

    createInventoryDisplay() {
        this.inventoryText = this.add.text(10, this.scale.height - 50, '', {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.updateInventoryDisplay();
    }

    updateInventoryDisplay() {
        const plantCounts = this.inventory.reduce((counts, plant) => {
            counts[plant.type] = (counts[plant.type] || 0) + 1;
            return counts;
        }, {});

        let inventoryText = 'Inventory:\n';
        for (const [type, count] of Object.entries(plantCounts)) {
            inventoryText += `${type}: ${count}\n`;
        }

        this.inventoryText.setText(inventoryText);
    }
}