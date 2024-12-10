import Phaser from 'phaser';
import Grid from '../classes/Grid';
import Plant from '../classes/Plant';
import Player from '../classes/Player';
import { saveGame, loadGame, autoSaveGame, loadAutoSave, checkAutoSave, deserializeGameState } from '../classes/SaveState';

export default class GameScene extends Phaser.Scene {
    private ROWS: number;
    private COLS: number;
    private states: any[];
    private redoStates: any[];
    private inventory: Plant[];
    private selectedPlant: Plant | null;
    private plantSelectionMenu: Phaser.GameObjects.Container | null;
    private drawnPlants: { [key: number]: { [key: number]: Phaser.GameObjects.Text } };
    private plantsSold: number;
    private winCondition: number;
    private grid!: Grid;
    private player!: Player;
    private turn: number;
    private turnText!: Phaser.GameObjects.Text;
    private inventoryText!: Phaser.GameObjects.Text;
    private cellInfoText!: Phaser.GameObjects.Text;

    constructor() {
        super("GameScene");
    }

    init() {
        this.ROWS = 3;
        this.COLS = 3;
        this.states = [];
        this.redoStates = [];
        this.inventory = [];
        this.selectedPlant = null;
        this.plantSelectionMenu = null; 
        this.drawnPlants = {};
        this.plantsSold = 0;
        this.winCondition = 5; // Number of plants to sell to win
    }

    create() {
        this.cameras.main.setBackgroundColor('#cd842f'); 

        this.grid = new Grid(this, this.ROWS, this.COLS);
        this.grid.offsetX += 150; // Shift the grid to the right to make space for the text
        this.grid.drawGrid(this);
        this.turn = 0;

        this.grid.checkGrowthConditions();
        this.drawPlants(this.grid);

        this.player = new Player(this, this.grid, 1, 1, "player");

        this.player.on('player-moved', () => {
            this.displayCellInfo(this.player.row, this.player.col);
            this.grid.emit('gamestate-changed');
        });

        // Add interactivity to the grid for placing plants
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            const x = pointer.x;
            const y = pointer.y;
            this.handleGridClick(this.grid, x, y);
        });

        // Create UI elements
        this.createSaveLoadButtons();
        this.createUndoButton();
        this.createRedoButton();
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

        this.grid.on('gamestate-changed', () => {
            this.redoStates = [];
            autoSaveGame(this.grid, this.inventory, this.player, this.turn, this.states);
            console.log('Game state changed');
        });

        autoSaveGame(this.grid, this.inventory, this.player, this.turn, this.states);
    }

    createSaveLoadButtons() {
        const saveButton = this.add.text(10, 10, 'Save Game', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        saveButton.on('pointerdown', () => {
            saveGame(this.grid, this.inventory, this.player, this.turn);
        });

        saveButton.on('pointerover', () => {
            saveButton.setStyle({ backgroundColor: '#734209' }); 
        });
    
        saveButton.on('pointerout', () => {
            saveButton.setStyle({ backgroundColor: '#a8671c' });
        });

        const loadButton = this.add.text(10, 40, 'Load Game', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        loadButton.on('pointerdown', () => {
            loadGame(this.grid, this.inventory, this.player, this);
        });

        // Hover effect
        loadButton.on('pointerover', () => {
            loadButton.setStyle({ backgroundColor: '#734209' }); 
        });
    
        loadButton.on('pointerout', () => {
            loadButton.setStyle({ backgroundColor: '#a8671c' });
        });

    }

    createUndoButton() {
        const undoButton = this.add.text(10, 70, 'Undo', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        undoButton.on('pointerdown', () => {
            if (this.states.length > 1) {
                this.redoStates.push(this.states.pop());
                const gameState = this.states[this.states.length - 1];
                deserializeGameState(gameState, this.grid, this.inventory, this.player, this);
            } else {
                alert('No more states to undo.');
            }
        });

        // Hover effect
        undoButton.on('pointerover', () => {
            undoButton.setStyle({ backgroundColor: '#734209' }); 
        });
    
        undoButton.on('pointerout', () => {
            undoButton.setStyle({ backgroundColor: '#a8671c' });
        });
    }

    createRedoButton() {
        const redoButton = this.add.text(10, 100, 'Redo', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        redoButton.on('pointerdown', () => {
            if (this.redoStates.length > 0) {
                const gameState = this.redoStates.pop();
                this.states.push(gameState);
                deserializeGameState(gameState, this.grid, this.inventory, this.player, this);
            } else {
                alert('No more states to redo.');
            }
        });

        // Hover effect
        redoButton.on('pointerover', () => {
            redoButton.setStyle({ backgroundColor: '#734209' }); 
        });
    
        redoButton.on('pointerout', () => {
            redoButton.setStyle({ backgroundColor: '#a8671c' });
        });
    }

    createTurnDisplay() {
        this.turnText = this.add.text(10, 130, `Turn: ${this.turn}`, {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        });
    }

    updateTurnDisplay() {
        this.turnText.setText(`Turn: ${this.turn}`);
    }

    createAdvanceTurnButton() {
        const button = this.add.text(10, 160, 'Next Turn', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        button.on('pointerdown', () => {
            this.advanceTurn();
        });

        // Hover effect
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#734209' }); 
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#a8671c' });
        });
    }

    createInventoryDisplay() {
        // Create a container for the inventory display
        this.inventoryContainer = this.add.container(10, this.scale.height - 250);
    
        // Background for the inventory area
        const background = this.add.rectangle(0, 0, 300, 180, 0x000000, 0.5)
            .setOrigin(0, 0);
        this.inventoryContainer.add(background);
    
        // Inventory title
        const title = this.add.text(10, 10, 'Inventory:', {
            fontSize: '16px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0);
        this.inventoryContainer.add(title);
    
        // Add an empty container for inventory items
        this.inventoryItemsContainer = this.add.container(10, 30);
        this.inventoryContainer.add(this.inventoryItemsContainer);
    
        this.updateInventoryDisplay();
    }
    createSellButton() {
        const button = this.add.text(10, 190, 'Sell Plant', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
            borderRadius: 8,
        }).setInteractive();

        button.on('pointerdown', (event: Phaser.Input.Pointer) => {
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

        // Hover effect
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#734209' }); 
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#a8671c' });
        });

        this.add.existing(button);
    }

    createRandomSeedButtons() {
    const plantTypes = ['potato', 'radish', 'wheat'];
    plantTypes.forEach((type, index) => {
        const x = 10; 
        const y = 220 + index * 50;

        // Add the seed sprite
        const seedSprite = this.add.sprite(x, y + 30, type, `${type}_16 0.aseprite`);
        seedSprite.setDisplaySize(32, 32); 
        seedSprite.setOrigin(0, 0.5); 

        // Add the text label next to the sprite
        const labelText = this.add.text(x + 40, y + 25, `Add ${type} Seed`, {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#a8671c',
            padding: { left: 10, right: 10, top: 5, bottom: 5 }
        }).setInteractive();

        // Handle the button click
        labelText.on('pointerdown', () => {
            this.addRandomSeed(type);
        });

        // Hover effect
        labelText.on('pointerover', () => {
            labelText.setStyle({ backgroundColor: '#734209' }); 
        });

        labelText.on('pointerout', () => {
            labelText.setStyle({ backgroundColor: '#a8671c' });
        });

        // Group the sprite and text label for easy management (optional)
        const buttonContainer = this.add.container(0, 0, [seedSprite, labelText]);
        buttonContainer.setSize(150, 40); // Adjust container size
        buttonContainer.setInteractive();
    });
}


    addRandomSeed(type: string) {
        const plant = new Plant(type, 1);
        this.inventory.push(plant);
        this.updateInventoryDisplay();
        // alert(`Added ${type} seed to inventory`);
    }

    updateInventoryDisplay() {
        // Clear existing inventory items
        this.inventoryItemsContainer.removeAll(true);
    
        // Dynamically add inventory items (sprites and text)
        this.inventory.forEach((plant, index) => {
            const x = 10; // Adjust as needed
            const y = index * 20; // Adjust spacing between items
    
            // Add the plant sprite
            const sprite = this.add.sprite(x, y, plant.type, `${plant.type}_16 0.aseprite`)
                .setOrigin(0, 0)
                .setScale(0.5); // Adjust size of the sprite
            this.inventoryItemsContainer.add(sprite);
    
            // Add the plant details text
            const text = this.add.text(x + 20, y, `Level ${plant.level}`, {
                fontSize: '14px',
                fill: '#ffffff',
                backgroundColor: '#a8671c',
            }).setOrigin(0, 0);
            this.inventoryItemsContainer.add(text);
        });
    }
    

    displayCellInfo(row: number, col: number) {
        const cell = this.grid.getCell(row, col);
        if (!this.cellInfoText) {
            this.cellInfoText = this.add.text(10, 400, '', { fontSize: '16px', fill: '#ffffff' }); // Adjusted position
        }

        let cellInfo = `Cell (${row}, ${col}):\n\n☀️ Sunlight: ${cell.sunlight}\n\n💧 Water: ${cell.water}`;

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
                        const oldLevel = plant.level;
                        plant.grow(cell.sunlight, cell.water, nearbyPlants);

                        if (plant.level !== oldLevel) {
                            const sprite = this.drawnPlants[row][col];
                            const frameName = `${plant.type}_16 ${plant.level}.aseprite`;
                            sprite.setFrame(frameName);
                        }
                    });
                }
            }
        }

        this.grid.emit('gamestate-changed');
    }

    handleGridClick(grid: Grid, x: number, y: number) {
        const col = Math.floor((x - grid.offsetX) / grid.cellSize);
        const row = Math.floor((y - grid.offsetY) / grid.cellSize);
    
        // Check if the click is within grid boundaries
        if (row >= 0 && row < this.ROWS && col >= 0 && col < this.COLS) {
            const cell = grid.getCell(row, col);
    
            // Check if the player is on the clicked cell
            if (this.player.row === row && this.player.col === col) {
                // Handle picking up a plant
                if (cell.plants && cell.plants.length > 0) {
                    this.pickUpPlant(cell.plants, row, col);
                    this.displayCellInfo(row, col); // Update cell info display
                } 
                // Handle placing a plant
                else if (this.inventory.length > 0) {
                    this.showPlantSelectionMenu(grid);
                } 
                // No plants in inventory
                else {
                    alert('No plants in inventory to place.');
                }
            } else {
                // Provide feedback if the player is not on the clicked cell
                alert('You need to move to the cell to interact with it.');
            }
        }
    }
    

    pickUpPlant(plants: Plant[], row: number, col: number) {
        if (plants.length > 0) {
            const plant = plants.pop()!; // Get the plant from the cell
            const pickedPlant = new Plant(plant.type, plant.level); // Clone the plant to inventory
            this.inventory.push(pickedPlant);
            this.selectedPlant = pickedPlant;
            this.updateInventoryDisplay();
    
            // Add animation feedback for plant pickup (optional)
            const pickupAnimation = this.add.text(
                this.grid.offsetX + col * this.grid.cellSize + this.grid.cellSize / 2,
                this.grid.offsetY + row * this.grid.cellSize + this.grid.cellSize / 2,
                `${plant.type} (Level ${plant.level})`,
                { fontSize: '16px', color: '#fff', backgroundColor: '#a8671c' }
            )
                .setOrigin(0.5)
                .setDepth(2);
    
            // Tween animation 
            this.tweens.add({
                targets: pickupAnimation,
                alpha: 0,
                y: pickupAnimation.y - 50, // Move upwards
                duration: 800,
                onComplete: () => {
                    pickupAnimation.destroy(); // Destroy after animation
                },
            });
    
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
    
            // Emit game state change event
            this.grid.emit('gamestate-changed');
    
            // Feedback for successful pickup
            // alert(`Picked up: ${plant.type} (Level ${plant.level})`);
        } else {
            alert('No plants to pick up.');
        }
    }
    

    drawPlants(grid: Grid) {
        // Clear previously drawn plants
        this.children.list.forEach(child => {
            if ((child as any).plantType) {
                child.destroy();
            }
        });

        this.drawnPlants = {};

        grid.plants.forEach(({ row, col, plant }) => {
            const x = grid.offsetX + col * grid.cellSize + grid.cellSize / 2;
            const y = grid.offsetY + row * grid.cellSize + grid.cellSize / 2;

            let spriteKey = '';
            if (plant.type === 'potato') {
                spriteKey = 'potato';
            } else if (plant.type === 'radish') {
                spriteKey = 'radish';
            } else if (plant.type === 'wheat') {
                spriteKey = 'wheat';
            }

            const frameName = `${spriteKey}_16 ${plant.level}.aseprite`;
            const sprite = this.add.sprite(x, y, spriteKey, frameName);
            sprite.setDisplaySize(grid.cellSize * 0.3, grid.cellSize * 0.3);

            // Tag the text object with plantType for easy identification
            // (text as any).plantType = plant.type;

            (sprite as any).plantType = plant.type;

            this.drawnPlants[row] = this.drawnPlants[row] || {};
            this.drawnPlants[row][col] = sprite;
        });
    }

    showPlantSelectionMenu(grid: Grid) {
        // Destroy the existing menu if it exists
        if (this.plantSelectionMenu) {
            this.plantSelectionMenu.destroy();
            this.plantSelectionMenu = null;
        }
    
        if (this.inventory.length > 0) {
            const plantCounts = this.inventory.reduce((counts, plant) => {
                counts[plant.type] = (counts[plant.type] || 0) + 1;
                return counts;
            }, {} as { [key: string]: number });
    
            // Create a container for the selection menu
            this.plantSelectionMenu = this.add.container(
                grid.offsetX + this.player.col * grid.cellSize,
                grid.offsetY + this.player.row * grid.cellSize
            );
            let y = 0;
    
            for (const [type, count] of Object.entries(plantCounts)) {
                // Create a sprite for the seed icon
                const seedSprite = this.add.sprite(0, y, type, `${type}_16 0.aseprite`);
                seedSprite.setDisplaySize(32, 32); // Adjust size of the sprite
                seedSprite.setOrigin(0, 0.5); // Align sprite to the left
    
                // Create a text label for the seed name and count
                const labelText = this.add.text(40, y, `${type} (${count})`, {
                    fontSize: '20px',
                    fill: '#ffffff',
                    backgroundColor: '#ab6616',
                    padding: { left: 10, right: 10, top: 5, bottom: 5 }
                }).setOrigin(0, 0.5); // Align text to the left and vertically center it
    
                // Make the text label interactive
                labelText.setInteractive();
                labelText.on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Input.PointerEvent) => {
                    const selectedPlant = this.inventory.find(plant => plant.type === type);
                    if (selectedPlant) {
                        const newPlant = new Plant(selectedPlant.type, selectedPlant.level);
                        grid.addPlant(this.player.row, this.player.col, newPlant);
                        this.inventory = this.inventory.filter(plant => plant !== selectedPlant);
                        this.selectedPlant = null;
                        this.drawPlants(grid);
                        this.updateInventoryDisplay();
                        this.plantSelectionMenu!.destroy(); // Destroy the menu after placing the plant
                        this.plantSelectionMenu = null; // Reset the menu reference
                        this.displayCellInfo(this.player.row, this.player.col); // Display cell info after placing the plant
                        this.grid.emit('gamestate-changed');
                    }
                    event.stopPropagation();
                });
    
                // Add both the sprite and text to the menu container
                this.plantSelectionMenu.add(seedSprite);
                this.plantSelectionMenu.add(labelText);
    
                // Increment the y position for the next button
                y += 40; // Adjust spacing as needed
            }
    
            this.add.existing(this.plantSelectionMenu);
        } else {
            alert('No plants in inventory');
        }
    }
    
}