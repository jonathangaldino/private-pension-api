import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { PrismaService } from '~/prisma.service';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { PlanModule } from './plan.module';

describe('PlanController', () => {
  let app: NestFastifyApplication;
  const prisma = new PrismaService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PlanModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /plans - should return 201 created', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);
    const body = PlanFactory.createPlanPtDTO(customer, product);

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(JSON.parse(res.body)).toHaveProperty('id', expect.any(String));
      });
  });

  it('POST /plans - should return 404 if the customer is not found', async () => {
    const body = PlanFactory.createPlanPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toMatch('Customer not found');
      });
  });

  it('POST /plans - should return 404 if the product is not found', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const body = PlanFactory.createPlanPtDTO(customer);

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toMatch('Product not found');
      });
  });

  it('POST /plans - should return 400 if the initial contribution is lower than required by the product', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const body = PlanFactory.createPlanPtDTO(customer, product, {
      aporte: product.minimumInitialContributionAmount - 10,
    });

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toMatch(
          'The minimum contribution amount is lower than the minimum required by the plan.',
        );
      });
  });

  it('POST /plans - should return 400 if the retirement age is not within the boundries of the product', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const body = PlanFactory.createPlanPtDTO(customer, product, {
      idadeDeAposentadoria: product.maxEntryAge + 1,
    });

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toMatch(
          'The retirement age provided is not within the range of min & max entry age of the selected product.',
        );
      });
  });

  it('POST /plans - should return 400 when trying to hire a plan after the expiration of sale', async () => {
    const saleExpirationDate = faker.date.recent();
    const pastHiringDate = faker.date.future({ refDate: saleExpirationDate });

    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(
      prisma,
      undefined,
      { saleExpiration: saleExpirationDate },
    );

    const body = PlanFactory.createPlanPtDTO(customer, product, {
      dataDaContratacao: pastHiringDate.toISOString(),
    });

    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body).toMatch(
          'This hiring date is expired for the selected plan.',
        );
      });
  });

  it('POST /plans - should return 409 when trying to hire a plan already hired', async () => {
    const customer = await CustomerFactory.createCustomerEntity(prisma);
    const product = await ProductFactory.createProductEntity(prisma);

    const body = PlanFactory.createPlanPtDTO(customer, product);

    // hire for the first time
    await app.inject({
      method: 'POST',
      url: '/plans',
      body,
    });

    // try to hire for the second time
    return app
      .inject({
        method: 'POST',
        url: '/plans',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(409);
        expect(res.body).toMatch('Plan already hired.');
      });
  });
});
