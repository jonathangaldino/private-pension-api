import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PlanNotFoundError } from '~/plan/plan.errors';
import { PrismaService } from '~/prisma.service';
import { ProductEntity } from '~/product/entities/product.entity';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanInvestmentFactory } from '../../test/modules/plan-investment/plan-investment.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { PlanInvestmentEntity } from './entities/plan-investment.entity';
import { MinimumExtraContributionAmountError } from './plan-investment.errors';
import { PlanInvestmentService } from './plan-investment.service';

describe('PlanInvestmentService', () => {
  let service: PlanInvestmentService;
  const prisma = new PrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanInvestmentService, PrismaService],
    }).compile();

    service = module.get<PlanInvestmentService>(PlanInvestmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns CustomerNotFoundError', async () => {
    const DTO = PlanInvestmentFactory.createPlanInvestmentDTO();

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create(DTO);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(CustomerNotFoundError);
  });

  describe('Business rules', () => {
    let customer: CustomerEntity;
    let product: ProductEntity;
    let plan: PlanEntity;

    beforeAll(async () => {
      customer = await CustomerFactory.createCustomerEntity(prisma);
      product = await ProductFactory.createProductEntity(prisma);
      plan = await PlanFactory.createPlanEntity(prisma, {
        customerId: customer.id,
        productId: product.id,
      });
    });

    it('returns PlanNotFoundError', async () => {
      const dto = PlanInvestmentFactory.createPlanInvestmentDTO(undefined, {
        planId: plan.id,
        customerId: customer.id,
      });

      // I did not created the customer before, so it should error.
      const { error, data } = await service.create({
        ...dto,
        planId: faker.string.uuid(),
      });

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(PlanNotFoundError);
    });

    it('returns MinimumExtraContributionAmountError if the contribution amount is not enought ', async () => {
      const dto = PlanInvestmentFactory.createPlanInvestmentDTO(undefined, {
        planId: plan.id,
        customerId: customer.id,
      });

      // I did not created the customer before, so it should error.
      const { error, data } = await service.create({
        ...dto,
        contributionAmount: product.minimumExtraContributionAmount - 10,
      });

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(MinimumExtraContributionAmountError);
    });

    it('returns a PlanInvestmentEntity when it succeds', async () => {
      const dto = PlanInvestmentFactory.createPlanInvestmentDTO(undefined, {
        planId: plan.id,
        customerId: customer.id,
        contributionAmount: product.minimumExtraContributionAmount + 10,
      });

      // I did not created the customer before, so it should error.
      const { error, data } = await service.create(dto);

      expect(error).toBeNull();
      expect(data).toBeInstanceOf(PlanInvestmentEntity);
    });
  });
});
