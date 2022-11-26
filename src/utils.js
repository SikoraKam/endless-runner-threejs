import { OBSTACLE_COLLISION_RANGE, TRACK } from "./const";
import { element } from "three/examples/jsm/nodes/shadernode/ShaderNodeBaseElements";

export const onWindowResize = (camera, renderer) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

export const gameOver = () => {
  console.log("gane over");
};

const getObstacleOnTrack = (track, obstacleGroup) => {
  // obstacles were randomly placed in createObstacleGroup to receive different layouts
  const sortedByPosition = obstacleGroup.children.sort(
    (obs1, obs2) => obs1.position.x - obs2.position.x
  );

  console.log("SORTED --", sortedByPosition);
  if (track === TRACK.LEFT) return sortedByPosition[0];
  if (track === TRACK.CENTER) return sortedByPosition[1];
  if (track === TRACK.RIGHT) return sortedByPosition[2];
};

export const collisionDetect = (player, obstacleGroup, obstacleBox) => {
  const obstaclePositionZ = obstacleGroup.position.z;
  const playerPositionZ = player.model.position.z;

  // console.log(obstacleGroup);
  if (
    playerPositionZ >= obstaclePositionZ + OBSTACLE_COLLISION_RANGE ||
    playerPositionZ <= obstaclePositionZ - OBSTACLE_COLLISION_RANGE
  )
    return;

  // get obstacle for actual player track
  const obstacleOnTrack = getObstacleOnTrack(
    player.currentTrack,
    obstacleGroup
  );

  if (!obstacleOnTrack) return;
  obstacleBox.setFromObject(obstacleOnTrack);

  // console.log(obstacleGroup.children);
  console.log(obstacleBox, player.boxCollider);

  if (player.boxCollider.intersectsBox(obstacleBox)) gameOver();
};
