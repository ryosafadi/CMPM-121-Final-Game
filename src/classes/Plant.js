export default class Plant {
  constructor(type, level = 1) {
    this.type = type // Plant type 
    this.level = level // Growth level
  }

  grow(sunlight, water) {
    // Growth condition: Sunlight and water must be greater than 0
    if (sunlight > 0 && water > 0) {
      this.level++
      console.log(`${this.type} grew to level ${this.level}!`)
    }
  }
}
