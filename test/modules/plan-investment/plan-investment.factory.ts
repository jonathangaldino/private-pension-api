import { faker } from '@faker-js/faker';
import {
  CreatePlanInvesmentPtDTO,
  CreatePlanInvestmentDTO,
} from '~/plan-investment/dto/create-plan-investment.dto';
import { PlanEntity } from '~/plan/entities/plan.entity';

export class PlanInvestmentFactory {
  static createPlanInvestmentDTO(
    plan?: PlanEntity,
    params?: Partial<CreatePlanInvestmentDTO>,
  ): CreatePlanInvestmentDTO {
    return {
      customerId: plan?.customerId || faker.string.uuid(),
      contributionAmount: faker.number.float({ min: 100, max: 2000 }),
      planId: plan?.id || faker.string.uuid(),
      ...params,
    };
  }

  static createPlanInvestmentPtDTO(
    params?: Partial<CreatePlanInvesmentPtDTO>,
  ): CreatePlanInvesmentPtDTO {
    return {
      idCliente: params?.idCliente || faker.string.uuid(),
      idPlano: params?.idPlano || faker.string.uuid(),
      valorAporte: faker.number.int({
        min: params?.valorAporte || 100,
        max: 1000,
      }),
    };
  }

  // static async createPlanInvestmentEntity(
  //   prisma: PrismaService,
  //   plan?: Partial<Omit<PlanEntity, 'id'>>,
  //   params?: Partial<PlanEntity>,
  // ): Promise<PlanEntity> {
  //   const dto = this.createPlanDTO();

  //   const persistedPlan = await prisma.plan.create({
  //     data: {
  //       ...dto,
  //       hiringDate: new Date(dto.hiringDate),
  //       ...params,
  //     },
  //   });

  //   return new PlanEntity(persistedPlan);
  // }
}
