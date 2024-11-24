"use strict"

import GameScene from "./scenes/GameScene.js";

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [GameScene]
}

const game = new Phaser.Game(config);