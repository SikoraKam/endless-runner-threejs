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
            this.eventBus.emit(EVENTS.ARROW_LEFT_DOWN);
          }
          if (event.key === "ArrowRight") {
            this.eventBus.emit(EVENTS.ARROW_RIGHT_DOWN);
          }
        },
        200,
        { trailing: false }
      )
    );
  }
}
