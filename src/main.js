"use strict"

import LoadScene from "./scenes/LoadScene.js";
import GameScene from "./scenes/GameScene.js";

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [LoadScene, GameScene]
}

const game = new Phaser.Game(config);