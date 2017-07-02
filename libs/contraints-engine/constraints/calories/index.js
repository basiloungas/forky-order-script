import BaseConstraint from '../base-constraint';

export default class CaloriesConstraint extends BaseConstraint {
  constructor() {
    super('CaloriesConstraint');
  }

  test(data, configData) {
    let result = false;
    let calories;

    try {
      calories = parseInt(data.recipe.calories, 10);
    } catch (ignore) {
      return false;
    }

    if (configData.max) {
      result = calories <= configData.max;
    }

    if (configData.min) {
      result = calories >= configData.min;
    }

    return result;
  }
}
