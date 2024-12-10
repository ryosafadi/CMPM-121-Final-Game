import Phaser from 'phaser';

export default class LanguageSelectionScene extends Phaser.Scene {
  constructor() {
    super('LanguageSelectionScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, height / 4, 'Select Language', {
      font: '48px Arial',
      fill: '#ffffff',
    }).setOrigin(0.5);

    const languages = [
      { code: 'en', label: 'English' },
      { code: 'zh', label: '中文' },
      { code: 'ar', label: 'العربية' },
    ];

    languages.forEach((lang, index) => {
      const button = this.add.text(width / 2, height / 2 + index * 50, lang.label, {
        font: '24px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000',
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      }).setOrigin(0.5);

      button.setInteractive();

      button.on('pointerdown', () => {
        localStorage.setItem('language', lang.code);
        this.scene.start('MenuScene');
      });
    });
  }
}