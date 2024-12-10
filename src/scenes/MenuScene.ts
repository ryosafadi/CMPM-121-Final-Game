import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#cd842f'); 

    const { width, height } = this.scale;

    // Add game title
    this.add.text(width / 2, height / 4, 'Space Farm', {
      font: '68px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(width / 2, height / 2, 'Start', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#a8671c',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5);

    startButton.setInteractive();

    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#734209' }); 
    });

    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#a8671c' });
    });

    // Add credits button
    const creditsButton = this.add.text(width / 2, height / 1.7, 'Credits', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#a8671c',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    }).setOrigin(0.5);

    creditsButton.setInteractive();

    creditsButton.on('pointerdown', () => {
      this.scene.start('CreditsScene');
    });

    // Hover effect
    creditsButton.on('pointerover', () => {
      creditsButton.setStyle({ backgroundColor: '#734209' }); 
    });

    creditsButton.on('pointerout', () => {
      creditsButton.setStyle({ backgroundColor: '#a8671c' });
    });
  }
}