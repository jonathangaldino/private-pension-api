import { Injectable } from '@nestjs/common';
import { ServiceResponse } from '~/core/interfaces/service.interfaces';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { PlanNotFoundError } from '~/plan/plan.errors';
import { PrismaService } from '~/prisma.service';
import { CreatePlanInvestmentDTO } from './dto/create-plan-investment.dto';
import { PlanInvestmentEntity } from './entities/plan-investment.entity';
import { MinimumExtraContributionAmountError } from './plan-investment.errors';

export type PlanInvestmentServiceErrors =
  | CustomerNotFoundError
  | PlanNotFoundError
  | MinimumExtraContributionAmountError;

@Injectable()
export class PlanInvestmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    planInvestment: CreatePlanInvestmentDTO,
  ): Promise<
    ServiceResponse<PlanInvestmentEntity, PlanInvestmentServiceErrors>
  > {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: planInvestment.customerId,
      },
    });

    if (!customer) {
      return {
        error: new CustomerNotFoundError(),
        data: null,
      };
    }

    const plan = await this.prisma.plan.findUnique({
      where: {
        id: planInvestment.planId,
        canceledAt: null,
      },
      include: {
        product: true,
      },
    });

    if (!plan) {
      return {
        error: new PlanNotFoundError(),
        data: null,
      };
    }

    const { product } = plan;

    if (
      planInvestment.contributionAmount < product.minimumExtraContributionAmount
    ) {
      return {
        error: new MinimumExtraContributionAmountError(),
        data: null,
      };
    }

    const persistedPlanInvestment = await this.prisma.planInvestment.create({
      data: {
        customerId: planInvestment.customerId,
        planId: planInvestment.planId,
        contributionAmount: planInvestment.contributionAmount,
      },
    });

    return {
      error: null,
      data: new PlanInvestmentEntity(persistedPlanInvestment),
    };
  }
}
