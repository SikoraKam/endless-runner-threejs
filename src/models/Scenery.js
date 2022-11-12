import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Object3D } from "three";

export class Scenery {
  fbxLoader = new FBXLoader();
  scenery3D = new Object3D();

  async initializeScenery() {
    this.scenery3D = await this.fbxLoader.loadAsync("wooden-cave.fbx");
    this.scenery3D.position.set(0, 0, -500);
    this.scenery3D.scale.set(0.05, 0.05, 0.05);
  }
}
