import Phaser from 'phaser';
import { TopDownScene } from './scenes/TopDownScene';
import { CabinetIsoScene } from './scenes/CabinetIsoScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  parent: 'app',
  backgroundColor: '#0d0f13',
  scene: [TopDownScene, CabinetIsoScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);

let currentSceneKey: 'top-down' | 'cabinet-iso' = 'top-down';
let switching = false;

function switchScene(): void {
  if (switching) return;
  switching = true;
  const next = currentSceneKey === 'top-down' ? 'cabinet-iso' : 'top-down';
  game.scene.stop(currentSceneKey);
  game.scene.start(next);
  currentSceneKey = next;
  setTimeout(() => { switching = false; }, 250);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'i' || e.key === 'I') {
    switchScene();
  }
});

const switchBtn = document.getElementById('switch-btn');
if (switchBtn) {
  switchBtn.addEventListener('click', switchScene);
}
