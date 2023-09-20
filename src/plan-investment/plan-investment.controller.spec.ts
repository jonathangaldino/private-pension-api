import { faker } from '@faker-js/faker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PrismaService } from '~/prisma.service';
import { ProductEntity } from '~/product/entities/product.entity';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanInvestmentFactory } from '../../test/modules/plan-investment/plan-investment.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { PlanInvestmentModule } from './plan-investment.module';

describe('PlanInvestment Controller', () => {
  let app: NestFastifyApplication;
  const prisma = new PrismaService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PlanInvestmentModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /plans-investment - should return 404 when customer is not found', async () => {
    const body = PlanInvestmentFactory.createPlanInvestmentPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/plans-investment',
        body: {
          ...body,
          expiracaoDeVenda: 'non-date',
        },
      })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toMatch('Customer not found');
      });
  });

  it('POST /plans-investment - should return 404 when customer is not found', async () => {
    const body = PlanInvestmentFactory.createPlanInvestmentPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/plans-investment',
        body: {
          ...body,
          expiracaoDeVenda: 'non-date',
        },
      })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toMatch('Customer not found');
      });
  });

  describe('business rules', () => {
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
    it('POST /plans-investment - should return 404 when plan is not found', async () => {
      const body = PlanInvestmentFactory.createPlanInvestmentPtDTO({
        idCliente: customer.id,
        idPlano: faker.string.uuid(),
      });

      return app
        .inject({
          method: 'POST',
          url: '/plans-investment',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(404);
          expect(res.body).toMatch('Plan not found');
        });
    });

    it('POST /plans-investment - returns 400 when the contribution amount is not enough', async () => {
      const body = PlanInvestmentFactory.createPlanInvestmentPtDTO({
        idCliente: customer.id,
        idPlano: plan.id,
      });

      return app
        .inject({
          method: 'POST',
          url: '/plans-investment',
          body: {
            ...body,
            valorAporte: product.minimumExtraContributionAmount - 10,
          },
        })
        .then((res) => {
          expect(res.statusCode).toEqual(400);
          expect(res.body).toMatch(
            'The contribution amount is lower than the product extra contribution amount.',
          );
        });
    });

    it('POST /plans-investment - returns 201 created', async () => {
      const body = PlanInvestmentFactory.createPlanInvestmentPtDTO({
        idCliente: customer.id,
        idPlano: plan.id,
        valorAporte: product.minimumExtraContributionAmount,
      });

      return app
        .inject({
          method: 'POST',
          url: '/plans-investment',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(201);
          expect(JSON.parse(res.body)).toHaveProperty('id', expect.any(String));
        });
    });
  });
});
