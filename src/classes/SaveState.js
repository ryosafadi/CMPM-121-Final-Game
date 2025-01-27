// classes/SaveState.js
import Plant from './Plant.js';

export function clearAutoSave() {
    localStorage.removeItem('auto_save');
}

export function serializeGameState(grid, inventory, player, turn) {
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

export function saveGame(grid, inventory, player, turn) {
    const gameState = serializeGameState(grid, inventory, player, turn);
    const saveSlot = prompt("Enter save slot name:");
    if (saveSlot) {
        localStorage.setItem(`save_${saveSlot}`, gameState);
        alert('Game saved successfully!');
    }
}

export function loadGame(grid, inventory, player, scene) {
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

export function autoSaveGame(grid, inventory, player, turn, states) {
    clearAutoSave();
    const gameState = serializeGameState(grid, inventory, player, turn);
    states.push(gameState);
    localStorage.setItem('auto_save', gameState);
}

export function loadAutoSave(grid, inventory, player, scene) {
    const gameState = localStorage.getItem('auto_save');
    if (gameState) {
        deserializeGameState(gameState, grid, inventory, player, scene);
        alert('Auto-save loaded successfully!');
    } else {
        alert('No auto-save found.');
    }
}

export function checkAutoSave() {
    return localStorage.getItem('auto_save') !== null;
}

export function deserializeGameState(gameState, grid, inventory, player, scene) {
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
    grid.plants = state.plants.map(({ row, col, type, level }) => {
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