import Phaser from 'phaser';

export default class Player extends Phaser.Events.EventEmitter{
    constructor(scene, grid, startRow, startCol, spriteKey) {
        super();

        this.scene = scene;
        this.grid = grid;

        // Set the player's initial position in the grid
        this.row = startRow;
        this.col = startCol;

        // Create the player's visual representation
        const startX = this.grid.offsetX + this.col * this.grid.cellSize + this.grid.cellSize / 2;
        const startY = this.grid.offsetY + this.row * this.grid.cellSize + this.grid.cellSize / 2;

        this.sprite = this.scene.add.sprite(startX, startY, spriteKey);
        this.sprite.setScale(this.grid.cellSize / this.sprite.width * 0.8);

        this.isMoving = false;
        this.keyPressed = null;

        this.addKeyListeners();
    }

    moveTo(row, col) {
        // Ensure the new position is within bounds
        if (row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols) {
            this.row = row;
            this.col = col;

            // Update the player's visual position
            const x = this.grid.offsetX + this.col * this.grid.cellSize + this.grid.cellSize / 2;
            const y = this.grid.offsetY + this.row * this.grid.cellSize + this.grid.cellSize / 2;
            this.sprite.setPosition(x, y);

            this.emit('player-moved');
        }
    }

    addKeyListeners() {
        this.scene.input.keyboard.on('keydown', (event) => {
            if (!this.isMoving) {
                this.isMoving = true;
                this.keyPressed = event.code;

                switch (event.code) {
                    case 'ArrowLeft':
                        this.moveTo(this.row, this.col - 1);
                        break;
                    case 'ArrowRight':
                        this.moveTo(this.row, this.col + 1);
                        break;
                    case 'ArrowUp':
                        this.moveTo(this.row - 1, this.col);
                        break;
                    case 'ArrowDown':
                        this.moveTo(this.row + 1, this.col);
                        break;
                }
            }
        });

        this.scene.input.keyboard.on('keyup', (event) => {
            if (event.code == this.keyPressed) 
            {
                this.isMoving = false;
                this.keyPressed = null;
            }
        });
    }
}
