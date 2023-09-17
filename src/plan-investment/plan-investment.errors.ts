import { UseCaseError } from 'src/core/known-error';

export class MinimumExtraContributionAmountError extends UseCaseError {
  description =
    'The contribution amount is lower than the product extra contribution amount.';

  constructor() {
    super(
      'The contribution amount is lower than the product extra contribution amount.',
    );
  }
}
