export class ProductEntity {
  id: string;
  susep: string;
  saleExpiration: string;
  minimumInitialContributionAmount: number;
  minimumExtraContributionAmount: number;
  minEntryAge: number; // age like
  maxEntryAge: number; // age like
  initialNeedForRedemption: number; // in days
  waitingPeriodBetweenRedemptions: number; // in days
}
