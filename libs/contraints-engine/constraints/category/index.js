import BaseConstraint from '../base-constraint';

export default class CategoryConstraint extends BaseConstraint {
  constructor() {
    super('CategoryConstraint');
  }

  test(data, configData) {
    // TODO: check for valid category names
    return data.category.toLowerCase() === configData.toLowerCase();
  }
}
