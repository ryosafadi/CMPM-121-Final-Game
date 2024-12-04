import Phaser from "phaser";

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload() {
        this.load.image("player", "../../assets/sprites/astronaut.png");
    }

    create() {
        this.scene.start("MenuScene");
    }
}
