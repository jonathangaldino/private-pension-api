import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PlanNotFoundError } from '~/plan/plan.errors';
import { PrismaService } from '~/prisma.service';
import { ProductEntity } from '~/product/entities/product.entity';
import { ClaimFactory } from '../../test/modules/claim/claim.factory';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanInvestmentFactory } from '../../test/modules/plan-investment/plan-investment.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import {
  ClaimBeforeInitialNeedForRedemptionError,
  MustWaitBetweenClaimsError,
  NotEnoughtBalanceError,
} from './claim.errors';
import { ClaimService } from './claim.service';
import { ClaimEntity } from './entities/claim.entity';

describe('ClaimService', () => {
  let service: ClaimService;
  const prisma = new PrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimService, PrismaService],
    }).compile();

    service = module.get<ClaimService>(ClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns PlanNotFoundError', async () => {
    const dto = ClaimFactory.createClaimDTO();
    const { error, data } = await service.create(dto);

    expect(error).toBeInstanceOf(PlanNotFoundError);
    expect(data).toBeNull();
  });

  describe('business rules', () => {
    let customer: CustomerEntity;
    let product: ProductEntity;
    let plan: PlanEntity;

    beforeEach(async () => {
      customer = await CustomerFactory.createCustomerEntity(prisma);
      product = await ProductFactory.createProductEntity(prisma);
      plan = await PlanFactory.createPlanEntity(prisma, {
        customerId: customer.id,
        productId: product.id,
      });
    });

    it('returns NotEnoughtBalanceError when the balance is not enough to withdraw', async () => {
      const pI = await PlanInvestmentFactory.createPlanInvestmentEntity(
        prisma,
        {},
        plan,
      );

      const dto = ClaimFactory.createClaimDTO({
        planId: plan.id,
        claimAmount: pI.contributionAmount + 1000,
      });

      const { error, data } = await service.create(dto);

      expect(error).toBeInstanceOf(NotEnoughtBalanceError);
      expect(data).toBeNull();
    });

    it('returns ClaimEntity when it succeeds', async () => {
      await PlanInvestmentFactory.createPlanInvestmentEntity(prisma, {}, plan);

      const dto = ClaimFactory.createClaimDTO({
        planId: plan.id,
      });

      const { error, data } = await service.create(dto);

      expect(error).toBeNull();
      expect(data).toBeInstanceOf(ClaimEntity);
    });

    it('cancels the plan if the entire balance is claimed', async () => {
      const productTwo = await ProductFactory.createProductEntity(prisma);

      const planTwo = await PlanFactory.createPlanEntity(prisma, {
        productId: productTwo.id,
        customerId: customer.id,
      });

      const dto = ClaimFactory.createClaimDTO({
        planId: planTwo.id,
        claimAmount: planTwo.initialContributionAmount,
      });

      const { error } = await service.create(dto);

      expect(error).toBeNull();

      const planTwoUpdated = await prisma.plan.findUnique({
        where: { id: planTwo.id },
      });
      expect(planTwoUpdated.canceledAt).not.toBeNull();
    });

    it('returns ClaimBeforeInitialNeedForRedemptionError when the first claim is happening before the first claim date', async () => {
      // Hiring a plan with mocked initialNeedForRedemption dates
      const productTwo = await ProductFactory.createProductEntity(
        prisma,
        undefined,
        { initialNeedForRedemption: 1 },
      );

      const nowMinusOneWeek = new Date();
      nowMinusOneWeek.setDate(
        nowMinusOneWeek.getDate() + productTwo.initialNeedForRedemption,
      );

      const planTwo = await PlanFactory.createPlanEntity(prisma, {
        hiringDate: faker.date.future({ refDate: nowMinusOneWeek }),
        productId: productTwo.id,
        customerId: customer.id,
      });

      await PlanInvestmentFactory.createPlanInvestmentEntity(
        prisma,
        {},
        planTwo,
      );

      const dto = ClaimFactory.createClaimDTO({
        planId: planTwo.id,
        claimAmount: 100,
      });

      const { error, data } = await service.create(dto);

      expect(error).toBeInstanceOf(ClaimBeforeInitialNeedForRedemptionError);
      expect(data).toBeNull();
    });

    it('returns MustWaitBetweenClaimsError when the claim is happening before the waiting date', async () => {
      await PlanInvestmentFactory.createPlanInvestmentEntity(prisma, {}, plan);

      // perform the first claim
      await ClaimFactory.createClaimEntity(prisma, {
        planId: plan.id,
        amount: 100,
      });

      // so the second claim should be this one
      // and should trigger a claim between dates error
      const dto = ClaimFactory.createClaimDTO({
        planId: plan.id,
        claimAmount: 100,
      });

      const { error, data } = await service.create(dto);

      expect(error).toBeInstanceOf(MustWaitBetweenClaimsError);
      expect(data).toBeNull();
    });
  });
});
