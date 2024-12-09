"use strict"

import Phaser from "phaser";

import LoadScene from "./scenes/LoadScene.js";
import MenuScene from "./scenes/MenuScene.js";
import CreditsScene from "./scenes/CreditsScene.js";
import GameScene from "./scenes/GameScene.js";
import LanguageSelectionScene from "./scenes/LanguageSelectionScene.js";

let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [LoadScene, MenuScene, LanguageSelectionScene, CreditsScene, GameScene]
}

const game = new Phaser.Game(config);