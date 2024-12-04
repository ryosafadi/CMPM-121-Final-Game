"use strict"

import Phaser from "phaser";

import LoadScene from "./scenes/LoadScene.js";
import MenuScene from './scenes/MenuScene.js';
import GameScene from "./scenes/GameScene.js";
import CreditsScene from './scenes/CreditsScene.js';

let config = {
    type: Phaser.AUTO,
    width: 800, 
    height: 600, 
    physics: { 
        default: 'arcade',
        arcade: {
          debug: false 
        }
    },
    scene: [LoadScene, MenuScene, GameScene, CreditsScene]
}

const game = new Phaser.Game(config);