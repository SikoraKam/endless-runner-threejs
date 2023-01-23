import {
  DISTANCE_OF_NEXT_OBSTACLE_GROUP,
  OBSTACLE_CENTER_POSITION_X,
  OBSTACLE_LEFT_POSITION_X,
  OBSTACLE_RIGHT_POSITION_X,
} from "./const";
import { VerticalObstacle } from "./models/VerticalObstacle";
import { HorizontalObstacle } from "./models/HorizontalObstacle";
import { Box3, Group, Object3D, Vector3 } from "three";

export class ObstaclesGroups {
  // only one instance of each obstacle type. Clone existing object instead of creating new one by constructor
  verticalObstacle = new VerticalObstacle();
  horizontalObstacle = new HorizontalObstacle();
  emptyObstacleImitation = new Object3D();

  firstVisibleObstacleGroup = new Group();
  secondVisibleObstacleGroup = new Group();
  obstacleBox = new Box3(new Vector3(), new Vector3());

  async load() {
    await this.verticalObstacle.load();
    await this.horizontalObstacle.load();

    this.firstVisibleObstacleGroup = this.createObstacleGroup();
    this.secondVisibleObstacleGroup = this.createObstacleGroup();
    this.secondVisibleObstacleGroup.position.z -= 450;
  }

  createEmptyObstacleImitation(positionX) {
    const mesh = this.emptyObstacleImitation.clone();
    // set y outside scene
    mesh.position.set(positionX, -999999, 0);
    return mesh;
  }

  createObstacleOnLeft(obstacleObject) {
    if (!obstacleObject)
      return this.createEmptyObstacleImitation(OBSTACLE_LEFT_POSITION_X);
    // clones existing object into passed position
    return obstacleObject.createObstacle(OBSTACLE_LEFT_POSITION_X);
  }

  createObstacleOnCenter(obstacleObject) {
    if (!obstacleObject)
      return this.createEmptyObstacleImitation(OBSTACLE_CENTER_POSITION_X);
    return obstacleObject.createObstacle(OBSTACLE_CENTER_POSITION_X);
  }

  createObstacleOnRight(obstacleObject) {
    if (!obstacleObject)
      return this.createEmptyObstacleImitation(OBSTACLE_RIGHT_POSITION_X);
    return obstacleObject.createObstacle(OBSTACLE_RIGHT_POSITION_X);
  }

  getRandomObstacle() {
    const random = Math.floor(Math.random() * 3);
    // 66% chances of getting horizontal obstacle
    return random < 1 ? this.verticalObstacle : this.horizontalObstacle;
  }

  // might be unnecessary
  // placeObstaclesOnRandomPosition(array) {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  // }

  createObstacleGroup() {
    const generatedObstacles = Array.from(Array(3)).map(() =>
      this.getRandomObstacle()
    );

    const verticalObstacleArr = generatedObstacles.filter(
      (el) => el instanceof VerticalObstacle
    );

    // creating empty space when 3 horizontal
    // in function createObstacleOnXXX null is treated like signal to create obstacle imitation
    if (!verticalObstacleArr.length) {
      const random = Math.floor(Math.random() * 3);
      generatedObstacles[random] = null;
    }

    const placedObstacles = [
      this.createObstacleOnLeft(generatedObstacles[0]),
      this.createObstacleOnCenter(generatedObstacles[1]),
      this.createObstacleOnRight(generatedObstacles[2]),
    ];

    // might be unnecessary
    // this.placeObstaclesOnRandomPosition(placedObstacles);

    const meshGroup = new Group();

    placedObstacles.forEach((obstacle) => {
      meshGroup.add(obstacle);
    });

    meshGroup.position.set(0, 0, DISTANCE_OF_NEXT_OBSTACLE_GROUP);
    meshGroup.visible = true;
    return meshGroup;
  }

  spawnObstacles(delta, speed) {
    const gameScene = this.firstVisibleObstacleGroup.parent;

    this.firstVisibleObstacleGroup.position.z += speed * delta;
    this.secondVisibleObstacleGroup.position.z += speed * delta;

    if (this.firstVisibleObstacleGroup.position.z > -40) {
      // remove from gameScene so group is not visible
      this.firstVisibleObstacleGroup.removeFromParent();
      // change group
      this.firstVisibleObstacleGroup = this.createObstacleGroup();
      // add to game scene again
      gameScene.add(this.firstVisibleObstacleGroup);
    }

    if (this.secondVisibleObstacleGroup.position.z > -40) {
      this.secondVisibleObstacleGroup.removeFromParent();
      this.secondVisibleObstacleGroup = this.createObstacleGroup();
      gameScene.add(this.secondVisibleObstacleGroup);
      // this.secondVisibleObstacleGroup.position.z =
      //   this.firstVisibleObstacleGroup.position.z - 450;
    }
  }

  getCloserObstacleGroup() {
    return this.firstVisibleObstacleGroup.position.z >
      this.secondVisibleObstacleGroup.position.z
      ? this.firstVisibleObstacleGroup
      : this.secondVisibleObstacleGroup;
  }
}
