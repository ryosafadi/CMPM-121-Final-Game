import Phaser from 'phaser'

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('CreditsScene')
  }

  create() {
    const { width, height } = this.scale

    // Add credits title
    this.add.text(width / 2, height / 4, 'Credits', {
      font: '32px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5)

    // Add credit details
    this.add.text(width / 2, height / 2.1, `Tool Lead: []`, {
      font: '20px Arial',
      fill: '#aaaaaa',
      align: 'center'
    }).setOrigin(0.5)

    this.add.text(width / 2, height / 1.8, `Engine Lead: []`, {
        font: '20px Arial',
        fill: '#aaaaaa',
        align: 'center'
      }).setOrigin(0.5)

      this.add.text(width / 2, height / 1.6, `Design Lead: []`, {
        font: '20px Arial',
        fill: '#aaaaaa',
        align: 'center'
      }).setOrigin(0.5)

    // Add back to menu button
    const backButton = this.add.text(width / 2, height * 3 / 4, 'Back', {
      font: '24px Arial',
      fill: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 }
    }).setOrigin(0.5)

    backButton.setInteractive()

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene') // Switch back to Menu Scene
    })
  }
}
