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
import { ClaimFactory } from '../../test/modules/claim/claim.factory';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { PlanInvestmentFactory } from '../../test/modules/plan-investment/plan-investment.factory';
import { PlanFactory } from '../../test/modules/plan/plan.factory';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { ClaimModule } from './claim.module';

describe('Claim Controller', () => {
  let app: NestFastifyApplication;
  const prisma = new PrismaService();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ClaimModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /claims - should return 404 when plan is not found', async () => {
    const body = ClaimFactory.createClaimPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/claims',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body).toMatch('Plan not found');
      });
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

    it('returns 201 with the id of the claim', async () => {
      const body = ClaimFactory.createClaimPtDTO({
        idPlano: plan.id,
        valorResgate: plan.initialContributionAmount,
      });

      return app
        .inject({
          method: 'POST',
          url: '/claims',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(201);
          expect(JSON.parse(res.body)).toHaveProperty('id', expect.any(String));
        });
    });

    it('returns 409 when claiming before the initial date allowed by the product', async () => {
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

      const body = ClaimFactory.createClaimPtDTO({
        idPlano: planTwo.id,
        valorResgate: 100,
      });

      return app
        .inject({
          method: 'POST',
          url: '/claims',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(409);
          expect(res.body).toMatch(
            'Not possible to claim before the initial days setup by the product.',
          );
        });
    });

    it('returns 409 when claiming between other claims and not waiting the necessary days', async () => {
      await PlanInvestmentFactory.createPlanInvestmentEntity(prisma, {}, plan);

      // perform the first claim
      await ClaimFactory.createClaimEntity(prisma, {
        planId: plan.id,
        amount: 100,
      });

      const body = ClaimFactory.createClaimPtDTO({
        idPlano: plan.id,
        valorResgate: 100,
      });

      return app
        .inject({
          method: 'POST',
          url: '/claims',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(409);
          expect(res.body).toMatch(
            'Must wait the required date before claiming again.',
          );
        });
    });

    it('returns 409 when claim amount is greater than the balance of the plan', async () => {
      const pI = await PlanInvestmentFactory.createPlanInvestmentEntity(
        prisma,
        {},
        plan,
      );

      const body = ClaimFactory.createClaimPtDTO({
        idPlano: plan.id,
        valorResgate: pI.contributionAmount + 1000,
      });

      return app
        .inject({
          method: 'POST',
          url: '/claims',
          body,
        })
        .then((res) => {
          expect(res.statusCode).toEqual(409);
          expect(res.body).toMatch('Not enought balance.');
        });
    });
  });
});
