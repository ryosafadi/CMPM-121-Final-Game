import Phaser from 'phaser';

interface Grid {
    offsetX: number;
    offsetY: number;
    cellSize: number;
    rows: number;
    cols: number;
}

export default class Player extends Phaser.Events.EventEmitter {
    private scene: Phaser.Scene;
    private grid: Grid;
    private sprite: Phaser.GameObjects.Sprite;
    private row: number;
    private col: number;
    private isMoving: boolean;
    private keyPressed: string | null;

    constructor(scene: Phaser.Scene, grid: Grid, startRow: number, startCol: number, spriteKey: string) {
        super();

        this.scene = scene;
        this.grid = grid;

        // Set the player's initial position in the grid
        this.row = startRow;
        this.col = startCol;

        // Create the player's visual representation
        const startX = this.getGridPositionX(this.col);
        const startY = this.getGridPositionY(this.row);

        this.sprite = this.scene.add.sprite(startX, startY, spriteKey);
        this.sprite.setScale((this.grid.cellSize / this.sprite.width) * 0.5);

        this.isMoving = false;
        this.keyPressed = null;

        this.addKeyListeners();
    }

    private getGridPositionX(col: number): number {
        return this.grid.offsetX + col * this.grid.cellSize + this.grid.cellSize / 2;
    }

    private getGridPositionY(row: number): number {
        return this.grid.offsetY + row * this.grid.cellSize + this.grid.cellSize / 2;
    }

    private isWithinBounds(row: number, col: number): boolean {
        return row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols;
    }

    moveTo(row: number, col: number): void {
        if (this.isMoving || !this.isWithinBounds(row, col)) return;

        this.row = row;
        this.col = col;

        // Update the player's visual position with a tween
        const x = this.getGridPositionX(this.col);
        const y = this.getGridPositionY(this.row);

        this.isMoving = true;
        this.scene.tweens.add({
            targets: this.sprite,
            x: x,
            y: y,
            duration: 200, // Adjust for desired smoothness
            onComplete: () => {
                this.isMoving = false;
                this.emit('player-moved');
            }
        });
    }

    private addKeyListeners(): void {
        this.scene.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            if (!this.isMoving) {
                this.keyPressed = event.code;

                switch (event.code) {
                    // Arrow keys for movement
                    case 'ArrowLeft':
                    case 'KeyA':
                        this.moveTo(this.row, this.col - 1);
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        this.moveTo(this.row, this.col + 1);
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        this.moveTo(this.row - 1, this.col);
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        this.moveTo(this.row + 1, this.col);
                        break;

                    // E key for picking up a plant
                    case 'KeyE':
                        this.emit('player-pickup', this.row, this.col);
                        break;
                }
            }
        });

        this.scene.input.keyboard.on('keyup', (event: KeyboardEvent) => {
            if (event.code === this.keyPressed) {
                this.keyPressed = null;
            }
        });
    }
}
