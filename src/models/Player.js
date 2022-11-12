import { AnimationMixer, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class Player {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  animationMixer;
  runningAnimation;

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

  update(deltaTime) {
    this.animationMixer.update(deltaTime);
  }
}
