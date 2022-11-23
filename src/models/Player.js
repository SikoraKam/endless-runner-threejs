import { AnimationMixer, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  DISTANCE_BETWEEN_TRACKS,
  HEIGHT_OF_JUMP,
  JUMP_DURATION,
  MOVE_TO_SIDE_DURATION,
  TRACK,
} from "../const";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

export class Player {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  animationMixer;
  currentAnimation;
  runningAnimation;
  jumpingAnimation;
  isJumping = false;
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
    this.currentAnimation = this.runningAnimation;
  }

  async makePlayerJump() {
    const { animations } = await this.fbxLoader.loadAsync("running-jump.fbx");
    this.jumpingAnimation = this.animationMixer.clipAction(animations[0]);
  }

  changeTrackAnimation() {
    // TODO
  }

  moveLeft() {
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

  jump() {
    if (this.isJumping) return;
    this.isJumping = true;
    this.currentAnimation.stop();
    this.currentAnimation = this.jumpingAnimation;
    this.currentAnimation.reset();
    this.currentAnimation.setLoop(1, 1);
    this.currentAnimation.clampWhenFinished = true;
    this.currentAnimation.play();
    this.animationMixer.addEventListener("finished", () => {
      this.currentAnimation
        .crossFadeTo(this.runningAnimation, 0.1, false)
        .play();
      this.currentAnimation = this.runningAnimation;
    });
    const jumpingUpAnimation = new TWEEN.Tween(this.model.position).to(
      {
        y: (this.model.position.y += HEIGHT_OF_JUMP),
      },
      JUMP_DURATION
    );

    const jumpingDownAnimation = new TWEEN.Tween(this.model.position).to(
      {
        y: (this.model.position.y -= HEIGHT_OF_JUMP),
      },
      JUMP_DURATION
    );
    jumpingDownAnimation.onComplete(() => {
      this.isJumping = false;
      // this.model.position.y = -35;
    });

    jumpingUpAnimation.start();
    jumpingUpAnimation.onComplete(() => {
      jumpingDownAnimation.start();
    });
  }

  update(deltaTime) {
    this.animationMixer.update(deltaTime);
  }
}
