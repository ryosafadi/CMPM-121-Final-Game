import Phaser from "phaser";

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene");
    }

    preload(): void {
        this.load.image("player", "../assets/astronaut.png");
    }

    create(): void {
        this.scene.start("MenuScene");
    }
}