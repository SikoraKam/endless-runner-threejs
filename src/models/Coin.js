import { Object3D } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { COIN_SCALE } from "../const";

export class Coin {
  fbxLoader = new FBXLoader();
  model = new Object3D();

  async load() {
    this.model = await this.fbxLoader.loadAsync("MarioCoin.fbx");
    this.model.scale.set(COIN_SCALE, COIN_SCALE, COIN_SCALE);

    this.model.rotation.set(0, 90 * (Math.PI / 180), 170 * (Math.PI / 180));
  }

  getCoin() {
    return this.model.clone();
  }
}
