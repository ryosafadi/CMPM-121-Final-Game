import Phaser from 'phaser';

import LoadScene from './scenes/LoadScene';
import MenuScene from './scenes/MenuScene';
import CreditsScene from './scenes/CreditsScene';
import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
    },
    scene: [LoadScene, MenuScene, CreditsScene, GameScene]
};

const game = new Phaser.Game(config);