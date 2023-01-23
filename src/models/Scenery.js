import { Box3, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DISTANCE_TO_SWITCH_SCENERY } from "../const";

export class Scenery {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  modelClone = new Object3D(); // firstly is placed behind original model, models are switched, scenery never ends
  scenerySize = 0;
  speed = 200;

  createAndPutSceneryClone() {
    this.modelClone = this.model.clone();
    const modelBox = new Box3().setFromObject(this.model);
    this.scenerySize = modelBox.max.z - modelBox.min.z - 140; // minus 140 for joining models
    this.modelClone.position.z = this.model.position.z - this.scenerySize;
  }

  async initializeScenery() {
    this.model = await this.fbxLoader.loadAsync("custom.fbx");
    this.model.position.set(0, -90, -500);
    this.model.rotateY(1.5707963268);
    this.model.scale.set(0.2, 0.2, 0.2);
    this.createAndPutSceneryClone();
  }

  updateScenerySpeed() {
    this.speed += 50;
  }

  moveScenery(deltaTime) {
    // move scenery models towards player model
    this.model.position.z += this.speed * deltaTime;
    this.modelClone.position.z += this.speed * deltaTime;

    // place behind second model when position is greater than threshold
    if (this.model.position.z > DISTANCE_TO_SWITCH_SCENERY)
      this.model.position.z = this.modelClone.position.z - this.scenerySize;
    if (this.modelClone.position.z > DISTANCE_TO_SWITCH_SCENERY)
      this.modelClone.position.z = this.model.position.z - this.scenerySize;
  }
}
