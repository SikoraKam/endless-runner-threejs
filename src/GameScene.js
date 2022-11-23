import { AnimationMixer, Clock, Scene } from "three";
import { Lights } from "./models/Lights";
import { Scenery } from "./models/Scenery";
import { Player } from "./models/Player";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import {} from "./events/EventBus.js";
import { debounce } from "lodash";
import EVENTS from "./events/events.js";
import eventBus from "./events/EventBus";
import { ObstaclesGroups } from "./models/ObstaclesGroups";

export class GameScene extends Scene {
  player = new Player();
  scenery = new Scenery();
  lights = new Lights();
  clock = new Clock();
  obstaclesGroup = new ObstaclesGroups();
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
    this.add(this.obstaclesGroup.firstVisibleObstacleGroup);
    this.add(this.obstaclesGroup.secondVisibleObstacleGroup);
  }

  cleanup() {}

  update() {
    const delta = this.clock.getDelta();
    if (!this.player.animationMixer) return;
    this.player.update(delta);
    TWEEN.update();

    this.obstaclesGroup.spawnObstacles(delta, this.scenery.speed);
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
