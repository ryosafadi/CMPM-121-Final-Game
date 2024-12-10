export default class Plant {
    constructor(type, level = 1, scene = null, row = null, col = null) {
        this.type = type;
        this.level = level;
        this.scene = scene;
        this.row = row;
        this.col = col;
    }

    grow(sunlight, water, nearbyPlants) {
        console.log(`Plant ${this.type} at level ${this.level} growing with sunlight: ${sunlight}, water: ${water}, nearby plants: ${nearbyPlants.length}`);
        
        if (sunlight >= 5 && water >= 5) {
            if ((this.type === 'potato' && nearbyPlants.length === 0) ||
                (this.type === 'wheat' && nearbyPlants.length === 1) ||
                (this.type === 'radish' && nearbyPlants.length >= 2)) {
                if (this.level < 3) {
                    this.level++;
                    console.log(`Plant ${this.type} grew to level ${this.level}`);
                    this.triggerGrowAnimation();
                } else {
                    console.log(`Plant ${this.type} is already at the maximum level of 3`);
                }
            } else {
                console.log(`Plant ${this.type} did not grow. Conditions - Sunlight: ${sunlight}, Water: ${water}, Nearby Plants: ${nearbyPlants.length}`);
            }
        }
    }

    triggerGrowAnimation() {
        const sprite = this.scene.drawnPlants[this.row][this.col];
        if (sprite) {
            if (this.type === 'potato') {
                sprite.anims.setCurrentFrame(sprite.anims.currentAnim.frames[this.level - 1]);
            } else if (this.type === 'wheat') {
                sprite.anims.setCurrentFrame(sprite.anims.currentAnim.frames[this.level - 1]);
            } else if (this.type === 'radish') {
                sprite.anims.setCurrentFrame(sprite.anims.currentAnim.frames[this.level - 1]);
            }
        }
    }
}