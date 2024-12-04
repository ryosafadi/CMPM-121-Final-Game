import Phaser from "phaser";

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload() {
        // Ensure the path is correct relative to your project's root
        this.load.image("player", "/assets/astronaut.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
