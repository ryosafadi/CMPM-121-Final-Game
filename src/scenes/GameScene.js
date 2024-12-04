import Phaser from 'phaser'

import Grid from '../classes/Grid.js'
import Plant from '../classes/Plant.js'
import Player from '../classes/Player.js'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
    this.turn = 0 // Track the current turn
    this.inventory = [] // Holds collected seeds
    this.seeds = [] // Track seeds on the grid
    this.interactionRange = []
  }

  init() {
    this.ROWS = 10
    this.COLS = 10
  }

  create() {
    const grid = new Grid(this, this.ROWS, this.COLS)
    this.grid = grid
    grid.drawGrid(this)

    this.player = new Player(this, grid, 1, 1, 'astronaut')

    // Listen for player movement and update cell info
    this.player.on('player-cell-changed', ({ row, col }) => {
      this.displayCellInfo(row, col)
    })

    this.player.on('player-interact', () => {
      this.handleSpaceAction()
    })

    // Randomly generate seeds
    this.spawnSeeds()

    // Display initial sun and water info for the player's starting cell
    this.displayCellInfo(1, 1)

    // Display turn info
    this.createTurnDisplay()

    // Create a button to advance the turn
    this.createAdvanceTurnButton()

    // Create inventory display
    this.createInventoryDisplay()
  }

  update() {
    this.player.update()
  }

  spawnSeeds() {
    const seedCount = 5 // Adjust the number of seeds to spawn
    this.seeds = []

    for (let i = 0; i < seedCount; i++) {
      const row = Phaser.Math.Between(0, this.ROWS - 1)
      const col = Phaser.Math.Between(0, this.COLS - 1)
      const x = this.grid.offsetX + col * this.grid.cellSize + this.grid.cellSize / 2
      const y = this.grid.offsetY + row * this.grid.cellSize + this.grid.cellSize / 2

      // Create a seed visual and store its data
      const seed = this.add.circle(x, y, this.grid.cellSize / 6, 0xffff00)
      seed.row = row
      seed.col = col
      this.seeds.push(seed)
    }
  }

  handleSpaceAction() {
    const playerRow = Math.floor((this.player.sprite.y - this.grid.offsetY) / this.grid.cellSize)
    const playerCol = Math.floor((this.player.sprite.x - this.grid.offsetX) / this.grid.cellSize)

    // Check if the player is on a seed
    const seedIndex = this.seeds.findIndex(seed => seed.row === playerRow && seed.col === playerCol)
    if (seedIndex >= 0) {
      // Collect the seed
      const seed = this.seeds[seedIndex]
      this.inventory.push('Seed')
      this.seeds.splice(seedIndex, 1) // Remove seed from array
      seed.destroy() // Remove seed from grid
      console.log('Collected a seed!')
      this.updateInventoryDisplay()
      return
    }

    // Check for a plant to reap or plant a seed
    const cell = this.grid.getCell(playerRow, playerCol)
    if (cell.plant) {
      console.log(`Reaped: ${cell.plant.type}`)
      this.inventory.push(`${cell.plant.type} (Level ${cell.plant.level})`)
      if (cell.plant.sprite) {
        cell.plant.sprite.destroy()
      }
      cell.plant = null
      this.updateInventoryDisplay()
    } else if (this.inventory.includes('Seed')) {
      // Plant a random type of seed
      const plantTypes = ['🌱', '🌿', '🌳']
      const randomType = Phaser.Utils.Array.GetRandom(plantTypes)

      console.log(`Planted a ${randomType} seed!`)
      cell.plant = new Plant(randomType, 1)
      const seedIndex = this.inventory.indexOf('Seed')
      this.inventory.splice(seedIndex, 1) // Remove a seed from inventory
      this.updateInventoryDisplay()

      // Add planting animation
      const x = this.grid.offsetX + playerCol * this.grid.cellSize + this.grid.cellSize / 2
      const y = this.grid.offsetY + playerRow * this.grid.cellSize + this.grid.cellSize / 2
      const plantText = this.add.text(x, y, randomType, {
        fontSize: `${this.grid.cellSize / 3}px`,
        align: 'center'
      }).setOrigin(0.5)

      cell.plant.sprite = plantText

      this.tweens.add({
        targets: plantText,
        alpha: 1,
        duration: 300
      })
    } else {
      console.log('You need a seed to plant!')
    }
  }

  advanceTurn() {
    this.turn += 1
    console.log(`Advancing to turn ${this.turn}`)

    // Update sun and water levels for all cells
    for (let row = 0; row < this.ROWS; row++) {
      for (let col = 0; col < this.COLS; col++) {
        const cell = this.grid.getCell(row, col)

        // Generate random sun and water levels
        const randomSun = Phaser.Math.Between(0, 10)
        const randomWater = Phaser.Math.Between(0, 3)

        cell.sunlight = randomSun
        cell.addWater(randomWater)

        // Trigger plant growth
        if (cell.plant) {
          const nearbyPlants = this.grid.getNearbyPlants(row, col)
          cell.plant.grow(cell.sunlight, cell.waterLevel, nearbyPlants)
        }

        console.log(`Cell (${row}, ${col}) - Sun: ${randomSun}, Water: ${cell.waterLevel}`)
      }
    }

    // Update the turn display
    this.updateTurnDisplay()
  }

  createTurnDisplay() {
    this.turnText = this.add.text(10, 10, `Turn: ${this.turn}`, {
      fontSize: '20px',
      fill: '#ffffff'
    })
  }

  updateTurnDisplay() {
    this.turnText.setText(`Turn: ${this.turn}`)
  }

  createAdvanceTurnButton() {
    const button = this.add.text(10, 40, 'Next Turn', {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#000'
    }).setInteractive()

    button.on('pointerdown', () => {
      this.advanceTurn()
    })
  }

  displayCellInfo(row, col) {
    const cell = this.grid.getCell(row, col)
    if (!this.cellInfoText) {
      this.cellInfoText = this.add.text(10, 70, '', { fontSize: '16px', fill: '#ffffff' })
    }
    this.cellInfoText.setText(`Cell (${row}, ${col}):\n☀️ Sunlight: ${cell.sunlight}\n💧 Water: ${cell.waterLevel}`)
  }

  createInventoryDisplay() {
    this.inventoryText = this.add.text(10, this.scale.height - 50, '', {
      fontSize: '20px',
      fill: '#ffffff'
    })
    this.updateInventoryDisplay()
  }

  updateInventoryDisplay() {
    this.inventoryText.setText(`Inventory: ${this.inventory.join(', ')}`)
  }
}
