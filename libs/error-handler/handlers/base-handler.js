export default class BaseHandler {
  constructor(name) {
    this.name = name;
  }

  handle() {
    throw Error(`#handle() method is undefined in ${this.name} class`);
  }
}
