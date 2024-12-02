"use strict"

import Phaser from "phaser";

import LoadScene from "./scenes/LoadScene.js";
import GameScene from "./scenes/GameScene.js";

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [LoadScene, GameScene]
}

const game = new Phaser.Game(config);