import Phaser from 'phaser';
import { CabinetIsoScene } from './scenes/CabinetIsoScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 700,
  parent: 'app',
  backgroundColor: '#0d0f13',
  scene: [CabinetIsoScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
