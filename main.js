import { PerspectiveCamera, WebGLRenderer } from "three";
import { GameScene } from "./src/GameScene";
import { onWindowResize } from "./src/utils";
import InputController from "./src/controllers/InputController";

const width = window.innerWidth;
const height = window.innerHeight;
const gameScene = new GameScene();
const perspectiveCamera = new PerspectiveCamera(60, width / height, 0.1, 1000);
const renderer = new WebGLRenderer({
  canvas: document.getElementById("app"),
  antialias: true,
  precision: "mediump",
});
renderer.setClearColor(0xe8fffc, 1);
renderer.setSize(width, height);

const render = () => {
  gameScene.update();
  renderer.render(gameScene, perspectiveCamera);
  requestAnimationFrame(render);
};

const gameLoop = async () => {
  await gameScene.loadModels();
  gameScene.initialize();
  render();
};

window.addEventListener("resize", () =>
  onWindowResize(perspectiveCamera, renderer)
);

new InputController();
gameLoop();
