import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { PrismaService } from '~/prisma.service';
import { ProductNotFoundError } from '~/product/product.errors';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import {
  HiringDateAfterExpirationDateError,
  InvalidHiringDateError,
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

  it('should return CustomerNotFoundError', async () => {
    const DTO = PlanFactory.createPlanDTO();

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create(DTO);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(CustomerNotFoundError);
  });

  it('should return ProductNotFoundError', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const DTO = PlanFactory.createPlanDTO(customer);

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create(DTO);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(ProductNotFoundError);
  });

  it('should return InvalidHiringDateError', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);
    const dto = PlanFactory.createPlanDTO(customer, product);

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create({
      ...dto,
      hiringDate: 'new string',
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(InvalidHiringDateError);
  });

  it('should return HiringDateAfterExpirationDateError', async () => {
    const saleExpirationDate = faker.date.recent();
    const pastHiringDate = faker.date.past({ refDate: saleExpirationDate });

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

    // I did not created the customer before, so it should error.
    const { error, data } = await service.create(dto);

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(HiringDateAfterExpirationDateError);
  });
});
