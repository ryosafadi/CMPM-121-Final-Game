export default class Player {
    constructor(scene, grid, startRow, startCol, spriteKey) {
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

        this.cursors = scene.input.keyboard.createCursorKeys();
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
        }
    }

    update() {
        // Handle input and move the player
        if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.moveTo(this.row, this.col - 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.moveTo(this.row, this.col + 1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.moveTo(this.row - 1, this.col);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.moveTo(this.row + 1, this.col);
        }
    }
}
