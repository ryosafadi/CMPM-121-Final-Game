import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const { width, height } = this.scale;

    // Add game title
    this.add.text(width / 2, height / 4, 'Space Farm', {
      font: '48px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Create Start button
    this.createButton(
      width / 2,
      height / 2,
      'Start',
      () => this.scene.start('GameScene') // Switch to Game Scene
    );

    // Create Credits button
    this.createButton(
      width / 2,
      height / 1.6,
      'Credits',
      () => this.scene.start('CreditsScene') // Switch to Credits Scene
    );
  }

  createButton(x, y, text, callback) {
    const button = this.add.text(x, y, text, {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5);

    button.setInteractive();

    button.on('pointerdown', callback);

    button.on('pointerover', () => button.setStyle({ backgroundColor: '#444444' }));
    button.on('pointerout', () => button.setStyle({ backgroundColor: '#000000' }));

    return button;
  }
}
