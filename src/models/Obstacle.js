import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Object3D } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export class Obstacle {
  objLoader = new OBJLoader();
  fbxLoader = new FBXLoader();
  model = new Object3D();

  constructor() {
    if (this.constructor === Obstacle) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  load() {
    throw new Error("Method 'load()' must be implemented.");
  }

  getObstacleClone() {
    throw new Error("Method 'getObstacleClone()' must be implemented.");
  }

  createObstacle() {
    throw new Error("Method 'createObstacle()' must be implemented.");
  }
}
