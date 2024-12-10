import Phaser from "phaser";

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload(): void {
        this.load.image("player", "../assets/astronaut.png");

        this.load.atlas('potato', '../assets/sprites/potato_16.png', '../assets/sprites/potato_16.json');
        this.load.atlas('radish', '../assets/sprites/radish_16.png', '../assets/sprites/radish_16.json');
        this.load.atlas('wheat', '../assets/sprites/wheat_16.png', '../assets/sprites/wheat_16.json');

        // this.load.spritesheet("potato", '../assets/sprites/potato_16.png', {
        //     frameWidth: 16,
        //     frameHeight: 16, 
        //   })
        //   this.load.spritesheet("radish", '../assets/sprites/radish_16.png', {
        //     frameWidth: 16,
        //     frameHeight: 16, 
        //   })
        //   this.load.spritesheet("wheat", '../assets/sprites/wheat_16.png', {
        //     frameWidth: 16,
        //     frameHeight: 16, 
        //   })
    }

    create(): void {
        this.scene.start("MenuScene");
    }
}