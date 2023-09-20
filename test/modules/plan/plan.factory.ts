import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { CreatePlanDTO, CreatePlanPtDTO } from '~/plan/dto/create-plan.dto';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PrismaService } from '~/prisma.service';
import { ProductEntity } from '~/product/entities/product.entity';

export class PlanFactory {
  static createPlanDTO(
    customer?: CustomerEntity,
    product?: ProductEntity,
    params?: Partial<CreatePlanDTO>,
  ): CreatePlanDTO {
    return {
      customerId: customer?.id || faker.string.uuid(),
      productId: product?.id || faker.string.uuid(),
      hiringDate: faker.date
        .past({
          years: 1,
          refDate: product?.saleExpiration || new Date(),
        })
        .toISOString(),
      retirementAge:
        product?.minEntryAge && product?.maxEntryAge
          ? faker.number.int({
              min: product.minEntryAge,
              max: product.maxEntryAge,
            })
          : faker.number.int({ max: 80 }),
      initialContributionAmount: faker.number.int({
        min: product?.minimumInitialContributionAmount || 100,
        max: 1000,
      }),
      ...params,
    };
  }

  static createPlanPtDTO(
    customer?: CustomerEntity,
    product?: ProductEntity,
    params?: Partial<CreatePlanPtDTO>,
  ): CreatePlanPtDTO {
    return {
      idCliente: customer?.id || faker.string.uuid(),
      idProduto: product?.id || faker.string.uuid(),
      dataDaContratacao: faker.date
        .past({
          years: 1,
          refDate: product?.saleExpiration || new Date(),
        })
        .toISOString(),
      idadeDeAposentadoria:
        product?.minEntryAge && product?.maxEntryAge
          ? faker.number.int({
              min: product.minEntryAge,
              max: product.maxEntryAge,
            })
          : faker.number.int(),
      aporte: faker.number.int({
        min: product?.minimumInitialContributionAmount || 100,
        max: 1000,
      }),
      ...params,
    };
  }

  static async createPlanEntity(
    prisma: PrismaService,
    plan?: Partial<Omit<PlanEntity, 'id'>>,
    params?: Partial<PlanEntity>,
  ): Promise<PlanEntity> {
    const dto = this.createPlanDTO();

    const dataToInsert: Prisma.PlanUncheckedCreateInput = {
      ...dto,
      ...plan,
      ...params,
    };

    const persistedPlan = await prisma.plan.create({
      data: dataToInsert,
    });

    return new PlanEntity(persistedPlan);
  }
}
