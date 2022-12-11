import { Clock, Scene } from "three";
import { Lights } from "./Lights";
import { Scenery } from "./models/Scenery";
import { Player } from "./models/Player";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import EVENTS from "./events/events.js";
import eventBus from "./events/EventBus";
import { ObstaclesGroups } from "./ObstaclesGroups";
import { collisionDetect, pickupCoinDetect } from "./utils";
import { CoinGroup } from "./CoinGroup";
import { htmlInitialize, htmlUpdate } from "./htmlUtlis";

export class GameScene extends Scene {
  player = new Player();
  scenery = new Scenery();
  lights = new Lights();
  clock = new Clock();
  obstaclesGroup = new ObstaclesGroups();
  coinsGroup = new CoinGroup();
  eventBus = eventBus;
  coinsAmount = 0;

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

    await this.coinsGroup.load();
    this.add(this.coinsGroup.visibleCoinsGroup);
  }

  cleanup() {}

  update() {
    const delta = this.clock.getDelta();
    if (!this.player.animationMixer) return;
    this.player.update(delta);
    this.scenery.moveScenery(delta);
    TWEEN.update();
    htmlUpdate(this.coinsAmount);

    this.obstaclesGroup.spawnObstacles(delta, this.scenery.speed);
    collisionDetect(
      this.player,
      this.obstaclesGroup.getCloserObstacleGroup(),
      this.obstaclesGroup.obstacleBox
    );

    pickupCoinDetect(
      this.player,
      this.coinsGroup.visibleCoinsGroup,
      this.coinsGroup.coinBox,
      this.increaseCoinsAmount
    );

    this.coinsGroup.spawnCoins(delta, this.scenery.speed);
  }

  initialize() {
    htmlInitialize();
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

  increaseCoinsAmount = () => {
    this.coinsAmount++;
  };
}
