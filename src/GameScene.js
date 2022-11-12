import { AmbientLight, Scene } from "three";
import { Lights } from "./models/Lights";
import { Scenery } from "./models/Scenery";

export class GameScene extends Scene {
  async loadModels() {
    const lights = new Lights();
    this.add(lights.directionalLight, lights.ambientLight);

    const scenery = new Scenery();
    await scenery.initializeScenery();
    this.add(scenery.scenery3D);
  }

  cleanup() {}

  update = () => {};
  initialize = () => {};
}
