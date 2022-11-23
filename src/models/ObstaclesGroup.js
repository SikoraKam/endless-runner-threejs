import {
  DISTANCE_OF_NEXT_OBSTACLE_GROUP,
  OBSTACLE_CENTER_POSITION_X,
  OBSTACLE_LEFT_POSITION_X,
  OBSTACLE_RIGHT_POSITION_X,
} from "../const";
import { VerticalObstacle } from "./VerticalObstacle";
import { HorizontalObstacle } from "./HorizontalObstacle";
import { instance } from "three/examples/jsm/nodes/shadernode/ShaderNodeElements";
import { Group } from "three";

export class ObstaclesGroup {
  obstaclesArray = [];
  verticalObstacle = new VerticalObstacle();
  horizontalObstacle = new VerticalObstacle();

  firstVisibleObstacleGroup = new Group();
  secondVisibleObstacleGroup = new Group();

  async load() {
    await this.verticalObstacle.load();
    await this.horizontalObstacle.load();
  }

  createObstacleOnLeft(obstacleObject) {
    if (!obstacleObject) return null;
    return obstacleObject.createObstacle(OBSTACLE_LEFT_POSITION_X);
  }

  createObstacleOnCenter(obstacleObject) {
    if (!obstacleObject) return null;
    return obstacleObject.createObstacle(OBSTACLE_CENTER_POSITION_X);
  }

  createObstacleOnRight(obstacleObject) {
    if (!obstacleObject) return null;
    return obstacleObject.createObstacle(OBSTACLE_RIGHT_POSITION_X);
  }

  getRandomObstacle() {
    const random = Math.floor(Math.random() * 3);
    // 66% chances of getting horizontal obstacle
    return random < 1
      ? this.verticalObstacle.getObstacleClone()
      : this.horizontalObstacle.getObstacleClone();
  }

  placeObstaclesOnRandomPosition(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  createObstacleGroup() {
    const generatedObstacles = Array.from(Array(3)).map(() =>
      this.getRandomObstacle()
    );

    const verticalObstacleArr = generatedObstacles.filter(
      (el) => el instanceof VerticalObstacle
    );

    // creating empty space when 3 horizontal
    if (!verticalObstacleArr.length) {
      const random = Math.floor(Math.random() * 3);
      generatedObstacles[random] = null;
    }

    const placedObstacles = [
      this.createObstacleOnLeft(generatedObstacles[0]),
      this.createObstacleOnCenter(generatedObstacles[1]),
      this.createObstacleOnRight(generatedObstacles[2]),
    ];

    this.placeObstaclesOnRandomPosition(placedObstacles);

    const meshGroup = new Group();
    placedObstacles.forEach((obstacle) => meshGroup.add(obstacle));
    meshGroup.position.set(0, 0, DISTANCE_OF_NEXT_OBSTACLE_GROUP);
    meshGroup.visible = false;
    this.obstaclesArray.push(meshGroup);
    return meshGroup;
  }

  spawnObstacles() {} // rather move to gameScene together with firstvisible and secondVisible
}
