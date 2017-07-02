export const isTimeslotError = (response) => {
  try {
    return !!Object
      .keys(response.data.error)
      .find(errorKey => errorKey.indexOf('timeslot') > -1);
  } catch (ign) {
    return false;
  }
};
