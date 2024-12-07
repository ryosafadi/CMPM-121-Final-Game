import Phaser from 'phaser';
import Grid from '../classes/Grid.js';
import Plant from '../classes/Plant.js';
import Player from '../classes/Player.js';
import { saveGame, loadGame, autoSaveGame, loadAutoSave, checkAutoSave } from '../classes/SaveState.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.inventory = [];
        this.selectedPlant = null;
        this.plantSelectionMenu = null; 
        this.drawnPlants = {};
        this.plantsSold = 0;
        this.winCondition = 5; // Number of plants to sell to win
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

        // Create UI elements
        this.createSaveLoadButtons();
        this.createTurnDisplay();
        this.createAdvanceTurnButton();
        this.createInventoryDisplay();
        this.createSellButton();
        this.createRandomSeedButtons();
        this.displayCellInfo(this.player.row, this.player.col);

        // Check for auto-save on game launch
        if (checkAutoSave()) {
            if (confirm("Do you want to continue where you left off?")) {
                loadAutoSave(this.grid, this.inventory, this.player, this);
            }
        }

        // Set up auto-save interval
        this.time.addEvent({
            delay: 30000, // Auto-save every 30 seconds
            callback: () => {
                autoSaveGame(this.grid, this.inventory, this.player, this.turn);
            },
            callbackScope: this,
            loop: true
        });
    }

    createSaveLoadButtons() {
        const saveButton = this.add.text(10, 10, 'Save Game', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000'
        }).setInteractive();

        saveButton.on('pointerdown', () => {
            saveGame(this.grid, this.inventory, this.player, this.turn);
        });

        const loadButton = this.add.text(10, 40, 'Load Game', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000'
        }).setInteractive();

        loadButton.on('pointerdown', () => {
            loadGame(this.grid, this.inventory, this.player, this);
        });
    }

    createTurnDisplay() {
        this.turnText = this.add.text(10, 70, `Turn: ${this.turn}`, {
            fontSize: '16px',
            fill: '#ffffff'
        });
    }

    updateTurnDisplay() {
        this.turnText.setText(`Turn: ${this.turn}`);
    }

    createAdvanceTurnButton() {
        const button = this.add.text(10, 100, 'Next Turn', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000'
        }).setInteractive();

        button.on('pointerdown', () => {
            this.advanceTurn();
        });
    }

    createInventoryDisplay() {
        this.inventoryText = this.add.text(10, this.scale.height - 50, '', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.updateInventoryDisplay();
    }

    createSellButton() {
        const button = this.add.text(10, 130, 'Sell Plant', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000'
        }).setInteractive();

        button.on('pointerdown', (event) => {
            const selectedPlant = this.selectedPlant;
            if (selectedPlant && selectedPlant.level === 3) {
                this.inventory = this.inventory.filter(plant => plant !== selectedPlant);
                alert(`Sold: ${selectedPlant.type} (Level ${selectedPlant.level})`);
                this.selectedPlant = null;
                this.plantsSold += 1;
                this.updateInventoryDisplay();
                if (this.plantsSold >= this.winCondition) {
                    alert('You win!');
                }
            } else {
                alert('Only level 3 plants can be sold.');
            }
            event.stopPropagation();
        });

        this.add.existing(button);
    }

    createRandomSeedButtons() {
        const plantTypes = ['🌱', '🌿', '🌳'];
        plantTypes.forEach((type, index) => {
            const button = this.add.text(10, 160 + index * 30, `Add ${type} Seed`, {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#000'
            }).setInteractive();

            button.on('pointerdown', () => {
                this.addRandomSeed(type);
            });

            this.add.existing(button);
        });
    }

    updateInventoryDisplay() {
        const inventoryText = this.inventory.map(plant => `${plant.type} (Level ${plant.level})`).join(',\n');
        this.inventoryText.setText(`Inventory:\n${inventoryText}`);
    }

    displayCellInfo(row, col) {
        const cell = this.grid.getCell(row, col);
        if (!this.cellInfoText) {
            this.cellInfoText = this.add.text(10, 250, '', { fontSize: '16px', fill: '#ffffff' }); // Adjusted position
        }

        let cellInfo = `Cell (${row}, ${col}):\n☀️ Sunlight: ${cell.sunlight}\n💧 Water: ${cell.water}`;

        if (cell.plants && cell.plants.length > 0) {
            const plant = cell.plants[cell.plants.length - 1]; // Get the newest plant
            cellInfo += `\n${plant.type} Level: ${plant.level}`;
        }

        this.cellInfoText.setText(cellInfo);
    }

    advanceTurn() {
        this.turn += 1;
        this.updateTurnDisplay();
        this.displayCellInfo(this.player.row, this.player.col);

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
            }
        }
    }

    handleGridClick(grid, x, y) {
        const col = Math.floor((x - grid.offsetX) / grid.cellSize);
        const row = Math.floor((y - grid.offsetY) / grid.cellSize);

        if (row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS) {
            const cell = grid.getCell(row, col);
            if (this.player.row === row && this.player.col === col) {
                if (cell.plants && cell.plants.length > 0) {
                    // Pick up plant from the cell
                    this.pickUpPlant(cell.plants, row, col);
                    cell.plants = []; // Clear the cell's plants array
                    this.displayCellInfo(row, col); // Update cell info display
                } else if (this.inventory.length > 0) {
                    // Place plant from inventory
                    this.showPlantSelectionMenu(grid);
                } else {
                    alert('No plants in inventory');
                }
            }
        }
    }

    pickUpPlant(plants, row, col) {
        if (plants.length > 0) {
            const plant = plants.pop();
            this.inventory.push(new Plant(plant.type, plant.level));
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

    drawPlants(grid) {
        // Clear previously drawn plants
        this.children.list.forEach(child => {
            if (child.plantType) {
                child.destroy();
            }
        });

        this.drawnPlants = {};

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
            this.drawnPlants[row] = this.drawnPlants[row] || {};
            this.drawnPlants[row][col] = text;
        });
    }

    showPlantSelectionMenu(grid) {
        if (this.plantSelectionMenu) {
            this.plantSelectionMenu.destroy(); // Destroy existing menu
        }

        if (this.inventory.length > 0) {
            const plantCounts = this.inventory.reduce((counts, plant) => {
                counts[plant.type] = (counts[plant.type] || 0) + 1;
                return counts;
            }, {});

            // Create a menu with buttons for each plant type
            this.plantSelectionMenu = this.add.container(grid.offsetX + this.player.col * grid.cellSize, grid.offsetY + this.player.row * grid.cellSize);
            let y = 0;

            for (const [type, count] of Object.entries(plantCounts)) {
                const button = this.add.text(0, y, `${type} (${count})`, {
                    fontSize: '20px',
                    fill: '#ffffff',
                    backgroundColor: '#000000',
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setInteractive();

                button.on('pointerdown', (pointer, localX, localY, event) => {
                    const selectedPlant = this.inventory.find(plant => plant.type === type);
                    if (selectedPlant) {
                        const newPlant = new Plant(selectedPlant.type, selectedPlant.level);
                        grid.addPlant(this.player.row, this.player.col, newPlant);
                        this.inventory = this.inventory.filter(plant => plant !== selectedPlant);
                        this.selectedPlant = null;
                        this.drawPlants(grid);
                        this.updateInventoryDisplay();
                        this.plantSelectionMenu.destroy(); // Destroy the menu after placing the plant
                        this.plantSelectionMenu = null; // Reset the menu reference
                        this.displayCellInfo(this.player.row, this.player.col); // Display cell info after placing the plant
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
}