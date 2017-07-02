import Promise from 'bluebird';
import axios from 'axios';
import errors from './errors';
import { isTimeslotError } from './helpers';

import timeslotData from './timeslots-data.json';

export default class ForkyAPI {
  constructor(config) {
    this.config = config;
  }

  getMenu() {
    const {
      baseUrl,
      getMenuEndpoint,
    } = this.config;

    const url = `${baseUrl}${getMenuEndpoint}`;

    return Promise
      .try(() => axios.get(url))
      .then(res => res.data)
      .catch((error) => {
        throw new errors.GenericAPIError(null, error);
      });
  }

  getMainDishes = () => this.getMenu().then(data => data.dishes.mains)

  getTimeslots() {
    return Promise.resolve(timeslotData);
  }

  getTimeslotIdsList(timeslotId) {
    return this.getTimeslots()
      .then(timeslots => timeslots.reduce((acc, item) => {
        if (item.id >= timeslotId) {
          acc.push(item.id);
        }
        return acc;
      }, []));
  }

  placeOrder(data) {
    const {
      timeslotId,
      deliveryAddressId,
      dishId,
    } = data;

    const {
      baseUrl,
      postOrderEndpoint,
      token,
    } = this.config;

    const url = `${baseUrl}${postOrderEndpoint}?access_token=${token}`;
    const orderData = {
      order: {
        deliveryAddress: deliveryAddressId,
        dishes: [
          {
            dish: dishId,
            portions: 1,
          },
        ],
        timeslot: timeslotId,
        documentType: 'RECEIPT',
        withCouvert: '1',
      },
    };

    return Promise
      .try(() => axios.post(url, orderData))
      .catch((error) => {
        switch (error.response.status) {
          case 400: {
            if (isTimeslotError(error.response)) {
              throw new errors.InvalidTimeslotError(null, error);
            }
            throw new errors.ValidationError(null, error);
          }
          case 401: {
            throw new errors.UnauthenticatedError(null, error);
          }
          case 406: {
            throw new errors.DeliveryOutOfRangeError(null, error);
          }
          case 410: {
            throw new errors.NoPortionLeftForDishError(null, error);
          }
          case 411: {
            throw new errors.InvalidDishError(null, error);
          }
          default: {
            throw new errors.GenericAPIError(null, error);
          }
        }
      });
  }
}
