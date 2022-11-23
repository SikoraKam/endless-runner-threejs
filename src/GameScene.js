import { AnimationMixer, Clock, Scene } from "three";
import { Lights } from "./models/Lights";
import { Scenery } from "./models/Scenery";
import { Player } from "./models/Player";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import {} from "./events/EventBus.js";
import { debounce } from "lodash";
import EVENTS from "./events/events.js";
import eventBus from "./events/EventBus";
import { ObstaclesGroup } from "./models/ObstaclesGroup";

export class GameScene extends Scene {
  player = new Player();
  scenery = new Scenery();
  lights = new Lights();
  clock = new Clock();
  obstaclesGroup = new ObstaclesGroup();
  eventBus = eventBus;

  async loadModels() {
    this.add(this.lights.directionalLight, this.lights.ambientLight);

    await this.scenery.initializeScenery();
    this.add(this.scenery.model);

    await this.player.initialize();
    this.add(this.player.model);

    await this.player.makePlayerRun();
    await this.player.makePlayerJump();

    await this.obstaclesGroup.load();
    // DONT FORGET ABOUT ADDING TO SCENE SOMEWHERE
    // this.add(this.obstaclesGroup.createObstacleGroup());
  }

  cleanup() {}

  update() {
    if (!this.player.animationMixer) return;
    this.player.update(this.clock.getDelta());
    this.scenery.moveScenery(this.clock.getDelta());
    TWEEN.update();
  }

  initialize() {
    this.eventBus.on(EVENTS.ARROW_LEFT_CLICK, () => {
      this.player.moveLeft();
    });
    this.eventBus.on(EVENTS.ARROW_RIGHT_CLICK, () => {
      this.player.moveRight();
    });
    this.eventBus.on(EVENTS.ARROW_UP_CLICK, () => {
      this.player.jump();
    });
  }
}
