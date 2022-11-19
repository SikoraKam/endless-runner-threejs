import { AnimationMixer, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  DISTANCE_BETWEEN_TRACKS,
  MOVE_TO_SIDE_DURATION,
  TRACK,
} from "../const";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

export class Player {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  animationMixer;
  runningAnimation;
  currentTrack = TRACK.CENTER;

  async initialize() {
    this.model = await this.fbxLoader.loadAsync("xbot.fbx");
    this.model.position.z = -110;
    this.model.position.y = -35;
    this.model.scale.set(0.1, 0.1, 0.1);
    this.model.rotation.y = 180 * (Math.PI / 180);
  }

  async makePlayerRun() {
    this.animationMixer = new AnimationMixer(this.model);
    const { animations } = await this.fbxLoader.loadAsync("xbot@running.fbx");
    this.runningAnimation = this.animationMixer.clipAction(animations[0]);
    this.runningAnimation.play();
  }

  changeTrackAnimation() {
    // TODO
  }

  moveLeft() {
    // TODO: fix - prevent going out of the box (ideas adding debounce, keeping track)
    console.log("move left", this.currentTrack);
    const positionX = this.model.position.x;
    if (positionX === -DISTANCE_BETWEEN_TRACKS) return;
    if (this.currentTrack === TRACK.LEFT) return;
    this.currentTrack =
      this.currentTrack === TRACK.CENTER ? TRACK.LEFT : TRACK.CENTER;

    const animationToLeft = new TWEEN.Tween(this.model.position)
      .to({ x: positionX - DISTANCE_BETWEEN_TRACKS }, MOVE_TO_SIDE_DURATION)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        if (positionX <= -DISTANCE_BETWEEN_TRACKS) {
          this.model.position.x = -DISTANCE_BETWEEN_TRACKS;
        }
        this.changeTrackAnimation();
      })
      .onComplete(() => {
        // TODO: update rotation if necessary after implementing changeTrackAnimation
      });

    animationToLeft.start();
  }

  moveRight() {
    console.log("move right", this.currentTrack);
    const positionX = this.model.position.x;

    if (positionX === DISTANCE_BETWEEN_TRACKS) return;
    if (this.currentTrack === TRACK.RIGHT) return;
    this.currentTrack =
      this.currentTrack === TRACK.CENTER ? TRACK.RIGHT : TRACK.CENTER;

    const animationToRight = new TWEEN.Tween(this.model.position)
      .to({ x: positionX + DISTANCE_BETWEEN_TRACKS }, MOVE_TO_SIDE_DURATION)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        if (positionX >= DISTANCE_BETWEEN_TRACKS) {
          this.model.position.x = DISTANCE_BETWEEN_TRACKS;
        }
        this.changeTrackAnimation();
      })
      .onComplete(() => {
        // TODO: update if necessary after implementing changeTrackAnimation
      });

    animationToRight.start();
  }

  update(deltaTime) {
    this.animationMixer.update(deltaTime);
  }
}
