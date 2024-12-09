export default class Plant {
    type: string;
    level: number;

    constructor(type: string, level: number) {
        this.type = type;
        this.level = level;
    }

    grow(sunlight: number, water: number, nearbyPlants: Plant[]): void {
        console.log(
            `Plant ${this.type} at level ${this.level} growing with sunlight: ${sunlight}, water: ${water}, nearby plants: ${nearbyPlants.length}`
        );

        // Implement growth logic based on sunlight, water, and nearby plants
        if (sunlight >= 5 && water >= 5) {
            if (
                (this.type === '🌱' && nearbyPlants.length === 0) ||
                (this.type === '🌿' && nearbyPlants.length === 1) ||
                (this.type === '🌳' && nearbyPlants.length >= 2)
            ) {
                if (this.level < 3) {
                    this.level++;
                    console.log(`Plant ${this.type} grew to level ${this.level}`);
                } else {
                    console.log(`Plant ${this.type} is already at the maximum level of 3`);
                }
            } else {
                console.log(
                    `Plant ${this.type} did not grow. Conditions - Sunlight: ${sunlight}, Water: ${water}, Nearby Plants: ${nearbyPlants.length}`
                );
            }
        }
    }
}