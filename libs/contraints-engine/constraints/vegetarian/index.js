import BaseConstraint from '../base-constraint';

export default class VegetarianConstraint extends BaseConstraint {
  constructor() {
    super('VegetarianConstraint');
  }

  test() {
    return true;
  }
}
