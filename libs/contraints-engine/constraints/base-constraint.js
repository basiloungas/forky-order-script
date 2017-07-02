export default class BaseConstraint {
  constructor(name) {
    this.name = name;
  }

  test() {
    throw Error(`#test() method is undefined in ${this.name} class`);
  }
}
