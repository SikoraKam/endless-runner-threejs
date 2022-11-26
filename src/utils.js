import { OBSTACLE_COLLISION_RANGE, TRACK } from "./const";

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

const mapTrackToPosition = (track) => {
  if (track === TRACK.LEFT) return 0;
  if (track === TRACK.CENTER) return 1;
  if (track === TRACK.RIGHT) return 2;
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
  const obstaclePosition = mapTrackToPosition(player.currentTrack);
  const obstacleOnTrack = obstacleGroup.children[obstaclePosition];
  if (!obstacleOnTrack) return;
  obstacleBox.setFromObject(obstacleOnTrack);

  console.log(obstacleBox, player.boxCollider);

  if (player.boxCollider.intersectsBox(obstacleBox)) gameOver();
};
