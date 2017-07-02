import BaseHandler from '../base-handler';

export default class ConsoleLogger extends BaseHandler {
  constructor(config) {
    super('ConsoleLogger');
    this.config = config;
  }

  handle(...args) {
    console.log.apply(null, args);
  }
}
