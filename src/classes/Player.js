import Phaser from 'phaser'

export default class Player extends Phaser.Events.EventEmitter {
  constructor(scene, grid, startRow, startCol, spriteKey= 'astronaut') {
    super()

    this.scene = scene
    this.grid = grid

    // Set the player's initial position
    const startX = this.grid.offsetX + startCol * this.grid.cellSize + this.grid.cellSize / 2
    const startY = this.grid.offsetY + startRow * this.grid.cellSize + this.grid.cellSize / 2

    // Add physics sprite for player
    this.sprite = this.scene.physics.add.sprite(startX, startY, spriteKey)
    this.sprite.setScale(this.grid.cellSize / this.sprite.width * 0.8)

    // Movement speed
    this.speed = 150

    // Set up input keys
    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.keys = this.scene.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
    })

    // Grid boundaries
    this.gridMinX = this.grid.offsetX
    this.gridMaxX = this.grid.offsetX + this.grid.gridWidth
    this.gridMinY = this.grid.offsetY
    this.gridMaxY = this.grid.offsetY + this.grid.gridHeight
  }

  update() {
    this.sprite.setVelocity(0)

    let moved = false

    // Movement logic
    if ((this.cursors.left.isDown || this.keys.A.isDown) && this.sprite.x > this.gridMinX + this.grid.cellSize / 2) {
      this.sprite.setVelocityX(-this.speed)
      moved = true
    } else if ((this.cursors.right.isDown || this.keys.D.isDown) && this.sprite.x < this.gridMaxX - this.grid.cellSize / 2) {
      this.sprite.setVelocityX(this.speed)
      moved = true
    }

    if ((this.cursors.up.isDown || this.keys.W.isDown) && this.sprite.y > this.gridMinY + this.grid.cellSize / 2) {
      this.sprite.setVelocityY(-this.speed)
      moved = true
    } else if ((this.cursors.down.isDown || this.keys.S.isDown) && this.sprite.y < this.gridMaxY - this.grid.cellSize / 2) {
      this.sprite.setVelocityY(this.speed)
      moved = true
    }

    if (moved) {
      const row = Math.floor((this.sprite.y - this.grid.offsetY) / this.grid.cellSize)
      const col = Math.floor((this.sprite.x - this.grid.offsetX) / this.grid.cellSize)
      this.emit('player-cell-changed', { row, col })
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      this.emit('player-interact')
    }
  }
}
