import EVENTS from "../events/events.js";
import Controller from "./Controller";
import { throttle } from "lodash";

export default class InputController extends Controller {
  constructor() {
    super();
    this.registerArrowListeners();
  }

  registerArrowListeners() {
    window.addEventListener(
      "keydown",
      throttle(
        (event) => {
          if (event.key === "ArrowLeft") {
            this.eventBus.emit(EVENTS.ARROW_LEFT_CLICK);
          }
          if (event.key === "ArrowRight") {
            this.eventBus.emit(EVENTS.ARROW_RIGHT_CLICK);
          }
          if (event.key === "ArrowUp") {
            this.eventBus.emit(EVENTS.ARROW_UP_CLICK);
          }
        },
        200,
        { trailing: false }
      )
    );
  }
}
