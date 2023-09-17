import { UseCaseError } from 'src/core/known-error';

export class DuplicatedFieldsError extends UseCaseError {
  description =
    'Identity or Email is duplicated. One of them exists in the database.';

  constructor() {
    super('Identity and/or email already exists.');
  }
}
