import { Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

export class Scenery {
  fbxLoader = new FBXLoader();
  model = new Object3D();

  async initializeScenery() {
    this.model = await this.fbxLoader.loadAsync("wooden-cave.fbx");
    this.model.position.set(0, 0, -500);
    this.model.scale.set(0.05, 0.05, 0.05);
  }
}
