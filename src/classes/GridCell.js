export default class GridCell {
    constructor() {
      this.sun = 0 // Sunlight (reset each turn)
      this.water = 0 // Water (accumulates over turns)
      this.plant = null // Reference to a plant in this cell, if any
    }
  
    get sunlight() {
      return this.sun
    }
  
    set sunlight(value) {
      this.sun = value
    }
  
    get waterLevel() {
      return this.water
    }
  
    set waterLevel(value) {
      this.water = value
    }
  
    resetSunlight() {
      this.sun = 0 // Reset sun at the end of the turn
    }
  
    addWater(amount) {
      this.water += amount // Accumulate water
    }
  
    hasPlant() {
      return this.plant !== null // Check if a plant exists in this cell
    }
  
    addPlant(plant) {
      if (this.plant) {
        console.log('Cell already has a plant!')
      } else {
        this.plant = plant // Add a plant to the cell
      }
    }
  
    removePlant() {
      this.plant = null // Remove the plant from the cell
    }
  }
  
  