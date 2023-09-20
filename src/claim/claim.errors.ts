import { UseCaseError } from '~/core/known-error';

// todo: find a better name for this
export class ClaimBeforeInitialNeedForRedemptionError extends UseCaseError {
  description = 'When trying to claim before initial need for redemption date';

  constructor() {
    super(
      'Not possible to claim before the initial days setup by the product.',
    );
  }
}

export class MustWaitBetweenClaimsError extends UseCaseError {
  description = 'When trying to claim before the date between claims.';

  constructor() {
    super('Must wait the required date before claiming again.');
  }
}

export class NotEnoughtBalanceError extends UseCaseError {
  description = 'User is trying to claim more than what they have.';

  constructor() {
    super('Not enought balance.');
  }
}
