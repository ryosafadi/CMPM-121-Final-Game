import Phaser from 'phaser';
import { getTranslation } from '../classes/translations';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Add game title
    this.add.text(width / 2, height / 4, getTranslation('title'), {
      font: '48px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(width / 2, height / 2, getTranslation('start'), {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5);

    startButton.setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Add credits button
    const creditsButton = this.add.text(width / 2, height / 1.6, getTranslation('credits'), {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5);

    creditsButton.setInteractive();

    creditsButton.on('pointerdown', () => {
      this.scene.start('CreditsScene');
    });

    // Add language switch button
    const languageButton = this.add.text(width / 2, height / 1.4, getTranslation('back'), {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5);

    languageButton.setInteractive();

    languageButton.on('pointerdown', () => {
      this.scene.start('LanguageSelectionScene');
    });
  }
}
