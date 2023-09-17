export abstract class KnownError extends Error {
  abstract override name: string;

  // public retry?: boolean = false;
  // Severe errors are those that are not expected to happen if everything is
  // well programmed.
  public severe?: boolean = false; // Better safe than not safe.

  constructor(
    message: string,
    public extras?: any,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UseCaseError extends KnownError {
  name = 'UseCaseError';

  constructor(message: string) {
    super(message);
  }
}
