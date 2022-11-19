export class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(eventName, handler) {
    this.listeners[eventName] = [...this.getListeners(eventName), handler];
  }

  off(eventName, handler) {
    this.listeners[eventName] = this.getListeners(eventName).filter(
      (listener) => listener !== handler
    );
  }

  emit(eventName, ...data) {
    this.getListeners(eventName).forEach((listener) => listener(...data));
  }

  getListeners(eventName) {
    return this.listeners[eventName] || [];
  }
}

const mainBus = new EventBus();

export default mainBus;
