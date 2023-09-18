import { UseCaseError } from '~/core/known-error';

export class ProductNotFoundError extends UseCaseError {
  description = 'Product was not found at the database.';

  constructor() {
    super('Product not found');
  }
}

export class InvalidSaleExpirationDateError extends UseCaseError {
  description = 'Invalid';

  constructor() {
    super('Expected DateTime with Timezone');
  }
}
