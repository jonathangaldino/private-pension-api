type EntityParams = {
  id: string;
  planId: string;
  amount: number;
};

export class ClaimEntity {
  readonly id: string;
  readonly planId: string;
  readonly amount: number;

  constructor(params: EntityParams) {
    this.id = params.id;
    this.planId = params.planId;
    this.amount = params.amount;
  }
}
