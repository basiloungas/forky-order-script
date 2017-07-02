import handlers from './handlers';

export default class ErrorHandler {
  registerHandlers(config) {
    // TODO: throw errors for non existing handlers
    this.handlers = Object
      .entries(config)
      .map(([key, data]) => new handlers[key](data));
  }

  handle(...args) {
    this.handlers.forEach(handler => handler.handle(...args));
  }
}
