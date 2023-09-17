import { UseCaseError } from 'src/core/known-error';

export class InvalidMinimumInitialContributionAmountError extends UseCaseError {
  description =
    'The minimum contribution amount is lower than what the plan requires.';

  constructor() {
    super(
      'The minimum contribution amount is lower than the minimum required by the plan.',
    );
  }
}

export class InvalidRetirementAgeError extends UseCaseError {
  description =
    'The retirement age provided is not within the range of min & max entry age of the selected product.';

  constructor() {
    super(
      'The retirement age provided is not within the range of min & max entry age of the selected product.',
    );
  }
}

export class AlreadyHiredPlanError extends UseCaseError {
  description = 'This customer already hired this plan.';

  constructor() {
    super('Plan already hired.');
  }
}

export class InvalidHiringDateError extends UseCaseError {
  description = 'Hiring date is not a valid date. Failed zod parsing.';

  constructor() {
    super('Expected DateTime with Timezone');
  }
}

export class HiringDateAfterExpirationDateError extends UseCaseError {
  description = 'Cannot hire a plan after sales expiration date.';

  constructor() {
    super('This hiring date is expired for the selected plan.');
  }
}
