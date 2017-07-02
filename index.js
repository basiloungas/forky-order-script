import Promise from 'bluebird';
import config from './config.json';
import ForkyAPI from './providers/forky';
import forkyApiErrors from './providers/forky/errors';

import ConstraintsEngine from './libs/contraints-engine';
import constraintErrors from './libs/contraints-engine/errors';

import ErrorHandler from './libs/error-handler';


// Initialize ErrorHandler
const errorhandler = new ErrorHandler();
errorhandler.registerHandlers(config.errorHandlers);

// Initialize ForkyAPI;
const forkyApi = new ForkyAPI(config.providers.forky);

// Initialize ConstraintsEngine
const constaintsEngine = new ConstraintsEngine(config.constraints);


// Hacky way of handling retrying for next timeslots
// TODO: try for previous timeslot as well?
let timeslotListIds;

const handleOrdering = (dish) => {
  const dishId = dish.id;
  const deliveryAddressId = config.addressId;
  const timeslotId = timeslotListIds.shift();

  if (!timeslotId) {
    throw new forkyApiErrors.NoTimeslotAvailableError();
  }

  console.log(`Trying to place order for dish ${dishId} on timeslot ${timeslotId}`);

  return forkyApi
    .placeOrder({
      timeslotId,
      deliveryAddressId,
      dishId,
    })
    .catch((error) => {
      if (error instanceof forkyApiErrors.InvalidTimeslotError) {
        errorhandler.handle(`Error: Timeslot ${timeslotId} is full, trying next available timeslot...\n`);
        return handleOrdering(dish);
      }

      throw error;
    });
};

// Main script flow
Promise
  .try(() => forkyApi
    .getTimeslotIdsList(config.timeslotId)
    .then(idsList => (timeslotListIds = idsList)),
  )
  .then(forkyApi.getMainDishes)
  .tap(dishes => console.log(`Got ${dishes.length} main dishes for the day!\n`))

  .then(constaintsEngine.selectDish)
  .tap(dish => console.log(`Selected dish: ${dish.id}\n`))

  .then(handleOrdering)
  .tap(() => console.log('Order placed successfully!'))

  .catch((error) => {
    if (error instanceof constraintErrors.NoAvailableDishError) {
      errorhandler.handle('Error: No available dish, TODO: send mail');
      return;
    }

    if (error instanceof forkyApiErrors.NoTimeslotAvailableError) {
      errorhandler.handle('Error: All timeslots today were full.\nBetter luck next day!');
      return;
    }

    if (error instanceof forkyApiErrors.NoPortionLeftForDishError) {
      errorhandler.handle('Error: No portions left for selected dish.\nTry updating your constraints.');
      return;
    }

    if (error instanceof forkyApiErrors.InvalidDishError) {
      errorhandler.handle('Error: Dish is not valid anymore.\nTry updating your constraints.');
      return;
    }

    if (error instanceof forkyApiErrors.DeliveryOutOfRangeError) {
      errorhandler.handle('Error: Delivery address is out of range.\nTry another delivery address.');
      return;
    }

    if (error instanceof forkyApiErrors.GenericAPIError) {
      errorhandler.handle('Error: Something went wrong while ordering.\nPlease try again later.');
      return;
    }

    errorhandler.handle(error);
  });
