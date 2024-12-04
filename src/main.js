"use strict"

import Phaser from "phaser";

import LoadScene from "./scenes/LoadScene.js";
import GameScene from "./scenes/GameScene.js";

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: 800, 
    height: 600, 
    physics: { 
        default: 'arcade',
        arcade: {
          debug: false 
        }
    },
    scene: [LoadScene, GameScene]
}

const game = new Phaser.Game(config);