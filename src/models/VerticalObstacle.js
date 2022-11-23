import { VERTICAL_OBSTACLE_SCALE_ARRAY } from "../const";
import { Obstacle } from "./Obstacle";

export class VerticalObstacle extends Obstacle {
  async load() {
    this.model = await this.fbxLoader.loadAsync("spike.fbx");
  }

  getObstacleClone() {
    return this.model.clone();
  }

  createObstacle(positionX) {
    const mesh = this.model.clone();
    mesh.scale.set(...VERTICAL_OBSTACLE_SCALE_ARRAY);
    mesh.position.set(positionX, -31, 0);
    return mesh;
  }
}
