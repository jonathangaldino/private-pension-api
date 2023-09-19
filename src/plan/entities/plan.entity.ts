type EntityParams = {
  id: string;
  customerId: string;
  productId: string;
  initialContributionAmount: number;
  hiringDate: Date;
  retirementAge: number;
};

export class PlanEntity {
  readonly id: string;
  readonly customerId: string;
  readonly productId: string;
  readonly initialContributionAmount: number;
  readonly hiringDate: Date;
  readonly retirementAge: number;

  constructor(params: EntityParams) {
    this.id = params.id;
    this.customerId = params.customerId;
    this.productId = params.productId;
    this.initialContributionAmount = params.initialContributionAmount;
    this.hiringDate = params.hiringDate;
    this.retirementAge = params.retirementAge;
  }
}
