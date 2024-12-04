import Phaser from 'phaser'
import GridCell from './GridCell.js'

export default class Grid extends Phaser.Events.EventEmitter {
  constructor(scene, rows, cols) {
    super()

    this.scene = scene
    this.rows = rows
    this.cols = cols

    // Define vertical margins
    const verticalMargin = 50 // Space at the top and bottom
    const availableHeight = this.scene.scale.height - verticalMargin * 2

    // Calculate cell size based on available dimensions
    this.cellWidth = Math.floor(this.scene.scale.width / this.cols)
    this.cellHeight = Math.floor(availableHeight / this.rows)
    this.cellSize = Math.min(this.cellWidth, this.cellHeight) // Ensure square cells

    // Calculate total grid size
    this.gridWidth = this.cols * this.cellSize
    this.gridHeight = this.rows * this.cellSize

    // Center the grid within the available space
    this.offsetX = (this.scene.scale.width - this.gridWidth) / 2
    this.offsetY = verticalMargin // Start below the top margin

    // Initialize grid cells with random sunlight and water levels
    this.gridCells = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = new GridCell()
        cell.sunlight = Phaser.Math.Between(0, 10) // Random sunlight level
        cell.addWater(Phaser.Math.Between(0, 5)) // Random water level
        this.gridCells.push(cell)
      }
    }

    // Initialize plants array
    this.plants = []
  }

  getCell(row, col) {
    return this.gridCells[row * this.cols + col]
  }

  drawGrid(scene) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = this.offsetX + col * this.cellSize + this.cellSize / 2
        const y = this.offsetY + row * this.cellSize + this.cellSize / 2

        // Draw the cell rectangle
        scene.add.rectangle(
          x, y,
          this.cellSize - 2, this.cellSize - 2,
          0x000000,
          0.1
        ).setStrokeStyle(2, 0xffffff)
      }
    }
  }

  getNearbyPlants(row, col) {
    const directions = [
      { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, // Up, Down
      { dr: 0, dc: -1 }, { dr: 0, dc: 1 }, // Left, Right
      { dr: -1, dc: -1 }, { dr: -1, dc: 1 }, // Diagonals
      { dr: 1, dc: -1 }, { dr: 1, dc: 1 }
    ]

    const nearbyPlants = []

    directions.forEach(({ dr, dc }) => {
      const newRow = row + dr
      const newCol = col + dc

      if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
        const cell = this.getCell(newRow, newCol)
        if (cell.plant) {
          nearbyPlants.push(cell.plant)
        }
      }
    })

    return nearbyPlants
  }

  applyGrowth() {
    this.gridCells.forEach((cell, index) => {
      if (cell.plant) {
        const row = Math.floor(index / this.cols)
        const col = index % this.cols

        const sunlight = cell.sunlight
        const water = cell.waterLevel
        const nearbyPlants = this.getNearbyPlants(row, col)

        cell.plant.grow(sunlight, water, nearbyPlants)
      }
    })
  }

  addPlant(row, col, plant) {
    const cell = this.getCell(row, col)
    if (!cell.plant) {
      cell.plant = plant
      this.plants.push(plant)
    } else {
      console.log(`Cell (${row}, ${col}) already has a plant!`)
    }
  }
}
