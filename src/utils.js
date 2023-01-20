import { OBSTACLE_COLLISION_RANGE, TRACK } from "./const";

export const onWindowResize = (camera, renderer) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const getObstacleOnTrack = (track, obstacleGroup) => {
  // obstacles were randomly placed in createObstacleGroup to receive different layouts
  const sortedByPosition = obstacleGroup.children.sort(
    (obs1, obs2) => obs1.position.x - obs2.position.x
  );

  if (track === TRACK.LEFT) return sortedByPosition[0];
  if (track === TRACK.CENTER) return sortedByPosition[1];
  if (track === TRACK.RIGHT) return sortedByPosition[2];
};

let collisionDetected = false; // blocks executing detection with one obstacle more than one time
export const collisionDetect = (player, obstacleGroup, obstacleBox) => {
  const obstaclePositionZ = obstacleGroup.position.z;
  const playerPositionZ = player.model.position.z;

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

  if (player.boxCollider.intersectsBox(obstacleBox)) {
    if (collisionDetected) return;
    collisionDetected = true;

    player.updateLifesNumber();
    setTimeout(() => {
      collisionDetected = false;
    }, 500);
  }
};

const getCoinsOnTrack = (track, coinsGroup) => {
  if (track === TRACK.LEFT)
    return coinsGroup.children.filter((coin) => coin.position.x < 0);
  if (track === TRACK.CENTER)
    return coinsGroup.children.filter((coin) => coin.position.x === 0);
  if (track === TRACK.RIGHT)
    return coinsGroup.children.filter((coin) => coin.position.x > 0);
};

export const pickupCoinDetect = (
  player,
  coinGroup,
  coinBox,
  increaseCoinsAmount
) => {
  const coinsOnTrack = getCoinsOnTrack(player.currentTrack, coinGroup);
  if (!coinsOnTrack?.length) return;

  coinsOnTrack?.forEach((coin) => {
    coinBox.setFromObject(coin);
    if (player.boxCollider.intersectsBox(coinBox)) {
      coin.visible = false;
      increaseCoinsAmount();
    }
  });
};
