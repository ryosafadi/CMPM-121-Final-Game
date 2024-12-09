// classes/SaveState.ts
import Plant from './Plant';

export function clearAutoSave(): void {
    localStorage.removeItem('auto_save');
}

export function serializeGameState(
    grid: { dataArray: any; plants: { row: number; col: number; plant: Plant }[] },
    inventory: any[],
    player: { row: number; col: number },
    turn: number
): string {
    const gameState = {
        grid: Array.from(grid.dataArray),
        inventory: inventory,
        player: {
            row: player.row,
            col: player.col
        },
        turn: turn,
        plants: grid.plants.map(({ row, col, plant }) => ({
            row,
            col,
            type: plant.type,
            level: plant.level
        }))
    };
    return JSON.stringify(gameState);
}

export function saveGame(
    grid: { dataArray: any; plants: any[] },
    inventory: any[],
    player: { row: number; col: number },
    turn: number
): void {
    const gameState = serializeGameState(grid, inventory, player, turn);
    const saveSlot = prompt("Enter save slot name:");
    if (saveSlot) {
        localStorage.setItem(`save_${saveSlot}`, gameState);
        alert('Game saved successfully!');
    }
}

export function loadGame(
    grid: { dataArray: any; plants: any[]; removePlant: (row: number, col: number, plant: Plant) => void; addPlant: (row: number, col: number, plant: Plant) => void },
    inventory: any[],
    player: { row: number; col: number; sprite: Phaser.GameObjects.Sprite },
    scene: any
): void {
    const saveSlot = prompt("Enter save slot name:");
    if (saveSlot) {
        const gameState = localStorage.getItem(`save_${saveSlot}`);
        if (gameState) {
            deserializeGameState(gameState, grid, inventory, player, scene);
            alert('Game loaded successfully!');
        } else {
            alert('No save found for that slot.');
        }
    }
}

export function autoSaveGame(
    grid: any,
    inventory: any[],
    player: { row: number; col: number },
    turn: number,
    states: string[]
): void {
    clearAutoSave();
    const gameState = serializeGameState(grid, inventory, player, turn);
    states.push(gameState);
    localStorage.setItem('auto_save', gameState);
}

export function loadAutoSave(
    grid: { dataArray: any; plants: any[]; removePlant: (row: number, col: number, plant: Plant) => void; addPlant: (row: number, col: number, plant: Plant) => void },
    inventory: any[],
    player: { row: number; col: number; sprite: Phaser.GameObjects.Sprite },
    scene: any
): void {
    const gameState = localStorage.getItem('auto_save');
    if (gameState) {
        deserializeGameState(gameState, grid, inventory, player, scene);
        alert('Auto-save loaded successfully!');
    } else {
        alert('No auto-save found.');
    }
}

export function checkAutoSave(): boolean {
    return localStorage.getItem('auto_save') !== null;
}

export function deserializeGameState(
    gameState: string,
    grid: {
        dataArray: any;
        plants: { row: number; col: number; plant: Plant }[];
        removePlant: (row: number, col: number, plant: Plant) => void;
        addPlant: (row: number, col: number, plant: Plant) => void;
    },
    inventory: any[],
    player: { row: number; col: number; sprite: Phaser.GameObjects.Sprite },
    scene: {
        turn: number;
        drawPlants: (grid: any) => void;
        updateInventoryDisplay: () => void;
        updateTurnDisplay: () => void;
        displayCellInfo: (row: number, col: number) => void;
    }
): void {
    const state = JSON.parse(gameState);
    grid.dataArray.set(state.grid);
    inventory.length = 0;
    inventory.push(...state.inventory);
    player.row = state.player.row;
    player.col = state.player.col;
    scene.turn = state.turn;

    grid.plants.forEach(({ row, col, plant }) => {
        grid.removePlant(row, col, plant);
    });

    // Restore plants
    grid.plants = state.plants.map(({ row, col, type, level }: { row: number; col: number; type: string; level: number }) => {
        const plant = new Plant(type, level);
        grid.addPlant(row, col, plant);
        return { row, col, plant };
    });

    // Update the game visuals
    scene.drawPlants(grid);
    scene.updateInventoryDisplay();
    scene.updateTurnDisplay();
    scene.displayCellInfo(player.row, player.col);

    // Update player position
    const x = grid.offsetX + player.col * grid.cellSize + grid.cellSize / 2;
    const y = grid.offsetY + player.row * grid.cellSize + grid.cellSize / 2;
    player.sprite.setPosition(x, y);
}