import { HORIZONTAL_OBSTACLE_SCALE_ARRAY } from "../const";
import { Obstacle } from "./Obstacle";

export class HorizontalObstacle extends Obstacle {
  async load() {
    this.model = await this.fbxLoader.loadAsync("red_barrier/barrier.fbx");
  }

  getObstacleClone() {
    return this.model.clone();
  }

  createObstacle(positionX) {
    const mesh = this.model.clone();
    mesh.scale.set(...HORIZONTAL_OBSTACLE_SCALE_ARRAY);
    // mesh.rotateY(3.1415926536);
    mesh.position.set(positionX, -35, 0);
    return mesh;
  }
}
