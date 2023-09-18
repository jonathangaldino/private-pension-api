import { Injectable } from '@nestjs/common';
import { PlanInvestment } from '@prisma/client';
import { ServiceResponse } from 'src/core/interfaces/service.interfaces';
import { CustomerNotFoundError } from 'src/customer/customer.errors';
import { PlanNotFoundError } from 'src/plan/plan.errors';
import { PrismaService } from 'src/prisma.service';
import { ProductNotFoundError } from 'src/product/product.errors';
import { CreatePlanInvestmentDTO } from './dto/create-plan-investment.dto';
import { MinimumExtraContributionAmountError } from './plan-investment.errors';

export type PlanInvestmentServiceErrors =
  | CustomerNotFoundError
  | PlanNotFoundError
  | ProductNotFoundError
  | MinimumExtraContributionAmountError;

@Injectable()
export class PlanInvestmentService {
  constructor(private prisma: PrismaService) {}

  async create(
    planInvestment: CreatePlanInvestmentDTO,
  ): Promise<ServiceResponse<PlanInvestment, PlanInvestmentServiceErrors>> {
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
    });

    if (!plan) {
      return {
        error: new PlanNotFoundError(),
        data: null,
      };
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: plan.productId,
      },
    });

    if (!product) {
      // this shouldn't happen but let's handle it
      return {
        error: new ProductNotFoundError(),
        data: null,
      };
    }

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
      data: persistedPlanInvestment,
    };
  }
}
