import Phaser from 'phaser';

import Grid from '../classes/Grid.js';
import Plant from '../classes/Plant.js';
import Player from '../classes/Player.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.inventory = [];
        this.selectedPlant = null;
        this.plantSelectionMenu = null; 
        this.drawnPlants = {};
    }

    init() {
        this.ROWS = 3;
        this.COLS = 3;
    }

    create() {
        this.grid = new Grid(this, this.ROWS, this.COLS);
        this.grid.offsetX += 150; // Shift the grid to the right to make space for the text
        this.grid.drawGrid(this);
        this.turn = 0;

        
        this.grid.checkGrowthConditions();
        this.drawPlants(this.grid);
            

        // Create boxes and add plants
        this.createBoxes(this.grid);
        this.spawnPlant('🌱');
        
        this.player = new Player(this, this.grid, 1, 1, "player");

        this.player.on('player-moved', () => {
            this.displayCellInfo(this.player.row, this.player.col);
        });

        // Add interactivity to the grid for placing plants
        this.input.on('pointerdown', (pointer) => {
            const x = pointer.x;
            const y = pointer.y;
            this.handleGridClick(this.grid, x, y);
        });

        // Display initial sun and water info for the player's starting cell
        this.displayCellInfo(1, 1);

        // Display turn info
        this.createTurnDisplay();
        this.createAdvanceTurnButton();
        this.createInventoryDisplay();
    }

    createBoxes(grid) {
        const plantTypes = ['🌱', '🌿', '🌳'];
        this.boxes = [
            { row: 0, col: 0, plants: [], type: plantTypes[0] },
            { row: 0, col: 1, plants: [], type: plantTypes[1] },
            { row: 0, col: 2, plants: [], type: plantTypes[2] }
        ];

        // Draw boxes with different colors and add interactivity
        this.drawBoxes(grid, this.boxes);

        // Draw plants on top of the boxes
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
            rect.setDepth(0); // Ensure the box is rendered below the text
        });
    }

    drawPlants(grid) {
        // Clear previously drawn plants
        this.children.list.forEach(child => {
            if (child.plantType) {
                child.destroy();
            }
        });
    
        grid.plants.forEach(({ row, col, plant }) => {
            const x = grid.offsetX + col * grid.cellSize + grid.cellSize / 2;
            const y = grid.offsetY + row * grid.cellSize + grid.cellSize / 2;
            const text = this.add.text(x, y, plant.type, {
                fontSize: `${grid.cellSize / 3}px`, // Smaller font size for plant emoji
                align: 'center'
            }).setOrigin(0.5);
            text.setDepth(1); // Ensure the text is rendered on top
    
            // Tag the text object with plantType for easy identification
            text.plantType = plant.type;
        });
    }

                handleBoxClick(box) {
            if (this.player.row === box.row && this.player.col === box.col) {
                if (this.selectedPlant) {
                    // Return plant to the box
                    box.plants.push(this.selectedPlant);
                    this.inventory = this.inventory.filter(plant => plant !== this.selectedPlant);
                    this.selectedPlant = null;
                    this.updateInventoryDisplay();
                    this.displayCellInfo(box.row, box.col); // Update cell info display
                    alert(`Returned: ${box.plants[box.plants.length - 1].type} (Level ${box.plants[box.plants.length - 1].level}) to the box`);
                } else if (box.plants.length > 0) {
                    // Pick up the plant from the box
                    const plant = box.plants.pop();
                    this.inventory.push(plant);
                    this.selectedPlant = plant;
                    this.updateInventoryDisplay();
                    this.displayCellInfo(box.row, box.col); // Update cell info display
                    alert(`Picked up: ${plant.type} (Level ${plant.level})`);
        
                    // Remove the drawn plant from the scene
                    if (this.drawnPlants[box.row] && this.drawnPlants[box.row][box.col]) {
                        this.drawnPlants[box.row][box.col].destroy();
                        delete this.drawnPlants[box.row][box.col];
                    }
                }
            }
        }

                pickUpPlant(plants, row, col) {
            if (plants.length > 0) {
                const plant = plants.pop();
                this.inventory.push(plant);
                this.selectedPlant = plant;
                this.updateInventoryDisplay();
        
                // Remove the drawn plant from the scene
                if (this.drawnPlants[row] && this.drawnPlants[row][col]) {
                    this.drawnPlants[row][col].destroy();
                    delete this.drawnPlants[row][col];
                }
        
                // Remove the plant from the grid
                this.grid.removePlant(row, col, plant);
        
                // Update cell info display
                if (plants.length === 0) {
                    this.cellInfoText.setText(''); // Clear the cell info text if no plants are left
                } else {
                    this.displayCellInfo(row, col); // Update cell info display
                }
        
                alert(`Picked up: ${plant.type} (Level ${plant.level})`);
            }
        }

                handleGridClick(grid, x, y) {
            const col = Math.floor((x - grid.offsetX) / grid.cellSize);
            const row = Math.floor((y - grid.offsetY) / grid.cellSize);
        
            if (row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS) {
                if (this.player.row === row && this.player.col === col) {
                    const cell = grid.getCell(row, col);
                    if (!cell.plant) {
                        // Place plant from inventory
                        if (!this.isBox(row, col)) {
                            this.showPlantSelectionMenu(grid, row, col);
                        }
                    } else {
                        // Pick up plant from the cell
                        this.pickUpPlant(cell.plants, row, col);
                        cell.plants = []; // Clear the cell's plants array
                        this.displayCellInfo(row, col); // Update cell info display
                    }
                } else {
                    alert('You need to be on top of the grid cell to interact with it.');
                }
            }
        }

    isBox(row, col) {
        return this.boxes.some(box => box.row === row && box.col === col);
    }

    showPlantSelectionMenu(grid, row, col) {
        if (this.plantSelectionMenu) {
            this.plantSelectionMenu.destroy(); // Destroy existing menu
        }
    
        if (this.inventory.length > 0) {
            const plantCounts = this.inventory.reduce((counts, plant) => {
                counts[plant.type] = (counts[plant.type] || 0) + 1;
                return counts;
            }, {});
    
            // Create a menu with buttons for each plant type
            this.plantSelectionMenu = this.add.container(grid.offsetX + col * grid.cellSize, grid.offsetY + row * grid.cellSize);
            let y = 0;
    
            for (const [type, count] of Object.entries(plantCounts)) {
                const button = this.add.text(0, y, `${type} (${count})`, {
                    fontSize: '20px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setInteractive();
    
                button.on('pointerdown', (event) => {
                    const selectedPlant = this.inventory.find(plant => plant.type === type);
                    if (selectedPlant) {
                        grid.addPlant(row, col, selectedPlant);
                        this.inventory = this.inventory.filter(plant => plant !== selectedPlant);
                        this.selectedPlant = null;
                        this.drawPlants(grid);
                        this.updateInventoryDisplay();
                        this.plantSelectionMenu.destroy(); // Destroy the menu after placing the plant
                        this.plantSelectionMenu = null; // Reset the menu reference
                        this.displayCellInfo(row, col); // Display cell info after placing the plant
                    }
                    event.stopPropagation();
                });
    
                this.plantSelectionMenu.add(button);
                y += 30;
            }
        } else {
            alert('No plants in inventory');
        }
    }

    createTurnDisplay() {
        this.turnText = this.add.text(10, 10, `Turn: ${this.turn}`, {
          fontSize: '20px',
          fill: '#ffffff'
        })
      }

    advanceTurn() {
        this.grid.emit('turn-changed');
        this.turn += 1;
        console.log(`Advancing to turn ${this.turn}`);
    
        // Update sun and water levels for all cells
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = this.grid.getCell(row, col);
    
                // Generate random sun and water levels
                const randomSun = Phaser.Math.Between(0, 10);
                const randomWater = Phaser.Math.Between(0, 5);
    
                cell.sunlight = randomSun;
                cell.water = randomWater;
    
                // Trigger plant growth
                if (cell.plants && cell.plants.length > 0) {
                    const nearbyPlants = this.grid.getNearbyPlants(row, col);
                    cell.plants.forEach(plant => {
                        plant.grow(cell.sunlight, cell.water, nearbyPlants);
                    });
                }
                console.log(`Cell (${row}, ${col}) - Sun: ${cell.sunlight}, Water: ${cell.water}`);
            }
        }
    
        // Update the turn display
        this.updateTurnDisplay();
        this.displayCellInfo(this.player.row, this.player.col);
    }

    updateTurnDisplay() {
        this.turnText.setText(`Turn: ${this.turn}`);
    }

    createAdvanceTurnButton() {
        const button = this.add.text(10, 40, 'Next Turn', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000'
        }).setInteractive();

        button.on('pointerdown', () => {
            this.advanceTurn();
            
            // Spawn plants based on the turn number
            if (this.turn % 3 === 0) {
                this.spawnPlant('🌱');
            }
            if (this.turn % 1 === 0) {
                this.spawnPlant('🌿');
            }
            if (this.turn % 2 === 0) {
                this.spawnPlant('🌳');
            }
        });
    }

        displayCellInfo(row, col) {
        const cell = this.grid.getCell(row, col);
        if (!this.cellInfoText) {
            this.cellInfoText = this.add.text(10, 70, '', { fontSize: '16px', fill: '#ffffff' });
        }
    
        let cellInfo = `Cell (${row}, ${col}):\n☀️ Sunlight: ${cell.sunlight}\n💧 Water: ${cell.water}`;
    
        if (cell.plants && cell.plants.length > 0) {
            const plant = cell.plants[cell.plants.length - 1]; // Get the newest plant
            cellInfo += `\n${plant.type} Level: ${plant.level}`;
        }
    
        this.cellInfoText.setText(cellInfo);
    }

    createInventoryDisplay() {
        this.inventoryText = this.add.text(10, this.scale.height - 50, '', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.updateInventoryDisplay();
    }

    updateInventoryDisplay() {
        const inventoryText = this.inventory.map(plant => `${plant.type} (Level ${plant.level})`).join(', ');
        this.inventoryText.setText(`Inventory: ${inventoryText}`);
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
                if (cell && cell.plant && !cell.plant.isPlaceholder) {
                    nearbyPlants.push(cell.plant);
                }
            }
        });
        return nearbyPlants;
    }

    spawnPlant(type) {
        const plant = new Plant(type, 1);
        const box = this.boxes.find(box => box.type === type);
        if (box) {
            box.plants.push(plant);
            this.grid.addPlant(box.row, box.col, plant);
            this.drawPlants(this.grid);
        }
    }
}