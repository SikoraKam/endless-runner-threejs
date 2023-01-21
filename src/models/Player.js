import {
  AnimationMixer,
  Box3,
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Vector3,
} from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import {
  DISTANCE_BETWEEN_TRACKS,
  HEIGHT_OF_JUMP,
  JUMP_DURATION,
  MOVE_TO_SIDE_DURATION,
  PLAYER_BOX_POSITION_Y,
  TRACK,
} from "../const";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { gameOver } from "../../main";

export class Player {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  animationMixer;
  currentAnimation;
  runningAnimation;
  jumpingAnimation;
  stumblingAnimation;
  isJumping = false;
  currentTrack = TRACK.CENTER;
  modelBox = new Mesh(
    new BoxGeometry(),
    new MeshPhongMaterial({ color: 0x0000ff })
  );
  boxCollider = new Box3(new Vector3(), new Vector3());
  lifes = 4;

  updateLifesNumber() {
    if (this.lifes > 0) this.lifes -= 1;
    if (this.lifes === 0) gameOver();
  }

  setPlayerBox() {
    this.modelBox.scale.set(50, 200, 20);
    this.modelBox.position.set(0, PLAYER_BOX_POSITION_Y, 0);
    this.modelBox.visible = false;
    this.model.add(this.modelBox);
  }

  async initialize() {
    this.model = await this.fbxLoader.loadAsync("xbot.fbx");
    this.model.position.z = -110;
    this.model.position.y = -35;
    this.model.scale.set(0.1, 0.1, 0.1);
    this.model.rotation.y = 180 * (Math.PI / 180);

    this.setPlayerBox();
  }

  async makePlayerRun() {
    this.animationMixer = new AnimationMixer(this.model);
    const { animations } = await this.fbxLoader.loadAsync("xbot@running.fbx");
    this.runningAnimation = this.animationMixer.clipAction(animations[0]);
    this.runningAnimation.play();
    this.currentAnimation = this.runningAnimation;
  }

  async loadPlayerJump() {
    const { animations } = await this.fbxLoader.loadAsync("running-jump.fbx");
    this.jumpingAnimation = this.animationMixer.clipAction(animations[0]);
  }

  async loadPlayerStumble() {
    const { animations } = await this.fbxLoader.loadAsync("stumbling.fbx");
    this.stumblingAnimation = this.animationMixer.clipAction(animations[0]);
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

    // TWEEN module is for smooth position change
    const animationToLeft = new TWEEN.Tween(this.model.position)
      .to({ x: positionX - DISTANCE_BETWEEN_TRACKS }, MOVE_TO_SIDE_DURATION)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        // additional condition for safety reasons - resets position if sth went wrong
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
    // necessary when we want animation to play one once and detected "finished" event
    this.currentAnimation.setLoop(1, 1);
    this.currentAnimation.clampWhenFinished = true;

    this.currentAnimation.play();
    this.animationMixer.addEventListener("finished", () => {
      this.currentAnimation
        .crossFadeTo(this.runningAnimation, 0.1, false) // smooth transition between animations
        .play();
      this.currentAnimation = this.runningAnimation;
    });
    // Tween for smooth position change
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
    });

    jumpingUpAnimation.start();
    jumpingUpAnimation.onComplete(() => {
      jumpingDownAnimation.start();
    });
  }

  stumble() {
    this.model.position.z += 10;
    this.model.position.y = -35;

    this.currentAnimation.crossFadeTo(this.stumblingAnimation, 0, false).play();
    this.currentAnimation = this.stumblingAnimation;
    this.currentAnimation.reset();

    this.currentAnimation.setLoop(1, 1);
    this.currentAnimation.clampWhenFinished = true;
    this.currentAnimation.play();
  }

  // update animation and box collider position for detecting collisions
  update(deltaTime) {
    this.animationMixer.update(deltaTime);
    this.boxCollider.setFromObject(this.modelBox);
  }
}
