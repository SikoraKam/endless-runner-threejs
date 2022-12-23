import { VERTICAL_OBSTACLE_SCALE_ARRAY } from "../const";
import { Obstacle } from "./Obstacle";

export class VerticalObstacle extends Obstacle {
  async load() {
    this.model = await this.fbxLoader.loadAsync("traffic_cone/1.fbx");
  }

  getObstacleClone() {
    return this.model.clone();
  }

  createObstacle(positionX) {
    const mesh = this.model.clone();
    mesh.scale.set(...VERTICAL_OBSTACLE_SCALE_ARRAY);
    mesh.position.set(positionX, -35, 0);
    return mesh;
  }
}
