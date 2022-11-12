import { AmbientLight, DirectionalLight } from "three";

export class Lights {
  constructor() {
    this.ambientLight = new AmbientLight(0xffffff, 20);
    this.directionalLight = new DirectionalLight(0xffffff, 3);
    this.directionalLight.position.set(0, 0, 1);
  }
}