import { HORIZONTAL_OBSTACLE_SCALE_ARRAY } from "../const";
import { Obstacle } from "./Obstacle";

export class HorizontalObstacle extends Obstacle {
  async load() {
    this.model = await this.fbxLoader.loadAsync("barrel.fbx");
  }

  getObstacleClone() {
    return this.model.clone();
  }

  createObstacle(positionX) {
    const mesh = this.model.clone();
    mesh.scale.set(...HORIZONTAL_OBSTACLE_SCALE_ARRAY);
    mesh.position.set(positionX, -21, 0);
    return mesh;
  }
}
