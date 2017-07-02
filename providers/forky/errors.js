import { BaseError } from 'make-error-cause';

class GenericAPIError extends BaseError {}
class ValidationError extends GenericAPIError {}
class UnauthenticatedError extends GenericAPIError {}
class DeliveryOutOfRangeError extends GenericAPIError {}
class NoPortionLeftForDishError extends GenericAPIError {}
class InvalidDishError extends GenericAPIError {}
class InvalidTimeslotError extends GenericAPIError {}
class NoTimeslotAvailableError extends GenericAPIError {}

export default {
  ValidationError,
  UnauthenticatedError,
  DeliveryOutOfRangeError,
  NoPortionLeftForDishError,
  InvalidDishError,
  InvalidTimeslotError,
  NoTimeslotAvailableError,
  GenericAPIError,
};
