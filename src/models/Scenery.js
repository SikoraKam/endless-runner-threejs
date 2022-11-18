import { Box3, Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { DISTANCE_TO_SWITCH_SCENERY } from "../const";

export class Scenery {
  fbxLoader = new FBXLoader();
  model = new Object3D();
  modelClone = new Object3D(); // first is placed behind model, models are switched, scenery never ends
  scenerySize = 0;
  speed = 15000;

  createAndPutSceneryClone() {
    this.modelClone = this.model.clone();
    const modelBox = new Box3().setFromObject(this.model);
    this.scenerySize = modelBox.max.z - modelBox.min.z - 1; // minus 1 for joining models
    this.modelClone.position.z = this.model.position.z + this.scenerySize;
  }

  async initializeScenery() {
    this.model = await this.fbxLoader.loadAsync("wooden-cave.fbx");
    this.model.position.set(0, 0, -500);
    this.model.scale.set(0.055, 0.055, 0.055);

    this.createAndPutSceneryClone();
  }

  moveScenery(deltaTime) {
    this.model.position.z += this.speed * deltaTime;
    this.modelClone.position.z += this.speed * deltaTime;

    if (this.model.position.z > DISTANCE_TO_SWITCH_SCENERY)
      this.model.position.z = this.modelClone.position.z - this.scenerySize;

    if (this.modelClone.position.z > DISTANCE_TO_SWITCH_SCENERY)
      this.modelClone.position.z = this.model.position.z - this.scenerySize;
  }
}
