import { AmbientLight, DirectionalLight } from "three";

export class Lights {
  constructor() {
    this.ambientLight = new AmbientLight(0xffffff, 1);
    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 20, 90);
  }
}
