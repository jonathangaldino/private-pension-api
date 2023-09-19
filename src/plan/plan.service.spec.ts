import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { PrismaService } from '~/prisma.service';
import { ProductNotFoundError } from '~/product/product.errors';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { PlanEntity } from './entities/plan.entity';
import {
  AlreadyHiredPlanError,
  HiringDateAfterExpirationDateError,
  InvalidHiringDateError,
  InvalidMinimumInitialContributionAmountError,
  InvalidRetirementAgeError,
} from './plan.errors';
import { PlanService } from './plan.service';

describe('PlanService', () => {
  let service: PlanService;
  const prisma = new PrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanService, PrismaService],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns CustomerNotFoundError', async () => {
    const DTO = PlanFactory.createPlanDTO();

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create(DTO);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(CustomerNotFoundError);
  });

  it('returns ProductNotFoundError', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const DTO = PlanFactory.createPlanDTO(customer);

    // I did not created the product before, so it should error.
    const { error, data } = await service.create(DTO);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(ProductNotFoundError);
  });

  it('returns InvalidHiringDateError', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);
    const dto = PlanFactory.createPlanDTO(customer, product);

    const { error, data } = await service.create({
      ...dto,
      hiringDate: 'new string', // hiring date is not a valid iso string
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(InvalidHiringDateError);
  });

  it('returns HiringDateAfterExpirationDateError', async () => {
    const saleExpirationDate = faker.date.recent();
    const pastHiringDate = faker.date.future({ refDate: saleExpirationDate });

    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(
      prisma,
      undefined,
      {
        saleExpiration: saleExpirationDate,
      },
    );

    const dto = PlanFactory.createPlanDTO(customer, product, {
      hiringDate: pastHiringDate.toISOString(),
    });

    const { error, data } = await service.create(dto);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(HiringDateAfterExpirationDateError);
  });

  it('returns InvalidMinimumInitialContributionAmountError when the initial contribution amount is lower than the minimum initial', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const dto = PlanFactory.createPlanDTO(customer, product, {
      initialContributionAmount: product.minimumInitialContributionAmount - 10,
    });

    const { error, data } = await service.create(dto);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(InvalidMinimumInitialContributionAmountError);
  });

  it('returns InvalidRetirementAgeError if the retirement age is not within boundries', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const dto = PlanFactory.createPlanDTO(customer, product, {
      retirementAge: product.maxEntryAge + 1,
    });

    const { error, data } = await service.create(dto);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(InvalidRetirementAgeError);
  });

  it('returns AlreadyHiredPlanError if the customer already hired this plan', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const dto = PlanFactory.createPlanDTO(customer, product, {});

    // create the plan for the first time
    await service.create(dto);

    const { error, data } = await service.create(dto);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(AlreadyHiredPlanError);
  });

  it('returns a PlanEntity when it succeeds', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const dto = PlanFactory.createPlanDTO(customer, product, {});

    const { error, data } = await service.create(dto);

    expect(error).toBeNull();
    expect(data).toBeInstanceOf(PlanEntity);
  });
});
