import { PerspectiveCamera, WebGLRenderer } from "three";
import { GameScene } from "./src/GameScene";
import { onWindowResize } from "./src/utils";
import InputController from "./src/controllers/InputController";

const width = window.innerWidth;
const height = window.innerHeight;
const perspectiveCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);
const renderer = new WebGLRenderer({
  canvas: document.getElementById("app"),
  antialias: true,
  precision: "mediump",
});
renderer.setClearColor(0xe8fffc, 1);
renderer.setSize(width, height);

let gameScene;

const animationLoop = () => {
  gameScene.update();
  renderer.render(gameScene, perspectiveCamera);
  const animation = requestAnimationFrame(animationLoop);
  if (gameScene.play === false) cancelAnimationFrame(animation);
};

const initScene = async () => {
  gameScene = new GameScene();
  await gameScene.loadModels();
  gameScene.initialize();
};

export const gameOver = () => {
  gameScene.gameOver();
};

window.addEventListener("resize", () =>
  onWindowResize(perspectiveCamera, renderer)
);
document.querySelector(".play-again").addEventListener("click", () => {
  initScene().then(() => {
    animationLoop();
    document.querySelector(".game-over").style.display = "none";
  });
});

new InputController();
initScene().then(() => animationLoop());
