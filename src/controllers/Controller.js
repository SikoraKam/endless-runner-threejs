import eventBus from "../events/EventBus";

export default class Controller {
  constructor() {
    this.eventBus = eventBus;
  }
}
