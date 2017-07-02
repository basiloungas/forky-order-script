import constraints from './constraints';
import { extractConfigForDate } from './utils';
import errors from './errors';

export default class ConstraintsEngine {
  constructor(config) {
    this.constraints = extractConfigForDate(new Date(), config);
  }

  selectDish = (dishes) => {
    const filteredDish = dishes.find(this.applyConstraints);

    if (filteredDish == null) {
      throw new errors.NoAvailableDishError('No dish available based on your constraints');
    }

    return filteredDish;
  }

  applyConstraints = (dish) => {
    const constraintFilter = constraint => Object
      .entries(constraint)
      .every(([key, configData]) => {
        const instance = new constraints[key]();

        return instance.test(dish, configData);
      });

    return !!this.constraints.find(constraintFilter);
  }
}
