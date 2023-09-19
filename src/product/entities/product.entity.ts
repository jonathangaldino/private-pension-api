type EntityParams = {
  id: string;
  name: string;
  susep: string;
  saleExpiration: Date;
  minimumInitialContributionAmount: number;
  minimumExtraContributionAmount: number;
  minEntryAge: number; // age like
  maxEntryAge: number; // age like
  initialNeedForRedemption: number; // in days
  waitingPeriodBetweenRedemptions: number; // in days
};

export class ProductEntity {
  readonly id: string;
  readonly name: string;
  readonly susep: string;
  readonly saleExpiration: Date;
  readonly minimumInitialContributionAmount: number;
  readonly minimumExtraContributionAmount: number;
  readonly minEntryAge: number; // age like
  readonly maxEntryAge: number; // age like
  readonly initialNeedForRedemption: number; // in days
  readonly waitingPeriodBetweenRedemptions: number; // in days

  constructor(params: EntityParams) {
    this.id = params.id;
    this.name = params.name;
    this.susep = params.susep;
    this.saleExpiration = params.saleExpiration;
    this.minimumInitialContributionAmount =
      params.minimumInitialContributionAmount;
    this.minimumExtraContributionAmount = params.minimumExtraContributionAmount;
    this.minEntryAge = params.minEntryAge;
    this.maxEntryAge = params.maxEntryAge;
    this.initialNeedForRedemption = params.initialNeedForRedemption;
    this.waitingPeriodBetweenRedemptions =
      params.waitingPeriodBetweenRedemptions;
  }
}
