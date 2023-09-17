import { UseCaseError } from 'src/core/known-error';

export class DuplicatedFieldsError extends UseCaseError {
  description =
    'Identity or Email is duplicated. One of them exists in the database.';

  constructor() {
    super('Identity and/or email already exists.');
  }
}

export class CustomerNotFoundError extends UseCaseError {
  description = 'Customer was not found.';

  constructor() {
    super('Customer not found');
  }
}

export class InvalidDateOfBirthError extends UseCaseError {
  description = 'Invalid date of birth - should be a date time with timezone.';

  constructor() {
    super('Invalid date of birth, expected a datetime with timezone');
  }
}
