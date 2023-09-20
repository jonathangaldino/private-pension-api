import { faker } from '@faker-js/faker';
import {
  CreatePlanInvesmentPtDTO,
  CreatePlanInvestmentDTO,
} from '~/plan-investment/dto/create-plan-investment.dto';
import { PlanInvestmentEntity } from '~/plan-investment/entities/plan-investment.entity';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PrismaService } from '~/prisma.service';

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

  static async createPlanInvestmentEntity(
    prisma: PrismaService,
    params?: Partial<PlanInvestmentEntity>,
    plan?: PlanEntity,
  ): Promise<PlanInvestmentEntity> {
    const dto = this.createPlanInvestmentDTO();

    const persistedPlan = await prisma.planInvestment.create({
      data: {
        ...dto,
        customerId: plan?.customerId || dto.customerId,
        planId: plan?.id || dto.planId,
        ...params,
      },
    });

    return new PlanInvestmentEntity(persistedPlan);
  }
}
