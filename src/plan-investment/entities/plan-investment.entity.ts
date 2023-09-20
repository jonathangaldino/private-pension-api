type EntityParams = {
  id: string;
  customerId: string;
  planId: string;
  contributionAmount: number;
};

export class PlanInvestmentEntity {
  readonly id: string;
  readonly customerId: string;
  readonly planId: string;
  readonly contributionAmount: number;

  constructor(params: EntityParams) {
    this.id = params.id;
    this.contributionAmount = params.contributionAmount;
    this.customerId = params.customerId;
    this.planId = params.planId;
  }
}
