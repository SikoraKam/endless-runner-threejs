import { AnimationMixer, Clock, Scene } from "three";
import { Lights } from "./models/Lights";
import { Scenery } from "./models/Scenery";
import { Player } from "./models/Player";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

export class GameScene extends Scene {
  player = new Player();
  scenery = new Scenery();
  lights = new Lights();
  clock = new Clock();

  async loadModels() {
    this.add(this.lights.directionalLight, this.lights.ambientLight);

    await this.scenery.initializeScenery();
    this.add(this.scenery.model);

    await this.player.initialize();
    this.add(this.player.model);

    await this.player.makePlayerRun();
  }

  cleanup() {}

  update() {
    if (!this.player.animationMixer) return;
    this.player.update(this.clock.getDelta());
    this.scenery.moveScenery(this.clock.getDelta());
    TWEEN.update();
  }

  initialize() {
    document.onkeydown = (event) => {
      if (event.key === "ArrowLeft") {
        this.player.moveLeft();
      }
      if (event.key === "ArrowRight") {
        this.player.moveRight();
      }
    };
  }
}
