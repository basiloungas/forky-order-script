export const dayMapper = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const extractConfigForDate = (date, config) => {
  const dayName = dayMapper[date.getDay()];

  if (config[dayName]) {
    return config[dayName];
  }

  // TODO: throw error if no global config
  return config.global;
};
