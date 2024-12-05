// FILE: src/classes/Plant.js
export default class Plant {
    constructor(type, level) {
        this.type = type;
        this.level = level;
    }

    grow(sunlight, water, nearbyPlants) {
        console.log(`Plant ${this.type} at level ${this.level} growing with sunlight: ${sunlight}, water: ${water}, nearby plants: ${nearbyPlants.length}`);
        
        // Implement growth logic based on sunlight, water, and nearby plants
        if (sunlight >= 5 && water >= 5 && nearbyPlants.length >= 0) {
            this.level++;
            console.log(`Plant ${this.type} grew to level ${this.level}`);
        } else {
            console.log(`Plant ${this.type} did not grow. Conditions - Sunlight: ${sunlight}, Water: ${water}, Nearby Plants: ${nearbyPlants.length}`);
        }
    }
}