export default class Plant {
    type: string;
    level: number;
    frames: { [key: number]: string };

    constructor(type: string, level: number) {
        this.type = type;
        this.level = level;

        // Define the sprite frames based on plant type
        if (type === 'potato') {
            this.frames = {
                0: 'potato_16 0.aseprite',
                1: 'potato_16 1.aseprite',
                2: 'potato_16 2.aseprite',
                3: 'potato_16 3.aseprite',
            };
        } else if (type === 'radish') {
            this.frames = {
                0: 'redish_16 0.aseprite',
                1: 'redish_16 1.aseprite',
                2: 'redish_16 2.aseprite',
                3: 'redish_16 3.aseprite',
            };
        } else if (type === 'wheat') {
            this.frames = {
                0: 'wheat_16 0.aseprite',
                1: 'wheat_16 1.aseprite',
                2: 'wheat_16 2.aseprite',
                3: 'wheat_16 3.aseprite',
            };
        } else {
            throw new Error(`Unknown plant type: ${type}`);
        }
    }

    grow(sunlight: number, water: number, nearbyPlants: Plant[]): void {
        console.log(
            `Plant ${this.type} at level ${this.level} growing with sunlight: ${sunlight}, water: ${water}, nearby plants: ${nearbyPlants.length}`
        );

        // Implement growth logic based on sunlight, water, and nearby plants
        if (sunlight >= 5 && water >= 5) {
            if (
                (this.type === 'potato' && nearbyPlants.length === 0) ||
                (this.type === 'radish' && nearbyPlants.length === 1) ||
                (this.type === 'wheat' && nearbyPlants.length >= 2)
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