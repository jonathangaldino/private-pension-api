import { Injectable } from '@nestjs/common';
import { ServiceResponse } from '~/core/interfaces/service.interfaces';
import { PlanNotFoundError } from '~/plan/plan.errors';
import { PrismaService } from '~/prisma.service';
import { ProductNotFoundError } from '~/product/product.errors';
import {
  ClaimBeforeInitialNeedForRedemptionError,
  MustWaitBetweenClaimsError,
  NotEnoughtBalanceError,
} from './claim.errors';
import { CreateClaimDTO } from './dto/create-claim.dto';
import { ClaimEntity } from './entities/claim.entity';

export type ClaimServiceErrors =
  | PlanNotFoundError
  | ProductNotFoundError
  | ClaimBeforeInitialNeedForRedemptionError
  | NotEnoughtBalanceError
  | MustWaitBetweenClaimsError;

@Injectable()
export class ClaimService {
  constructor(private prisma: PrismaService) {}

  async create(
    claimDTO: CreateClaimDTO,
  ): Promise<ServiceResponse<ClaimEntity, ClaimServiceErrors>> {
    const plan = await this.prisma.plan.findUnique({
      where: {
        id: claimDTO.planId,
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
      return {
        error: new ProductNotFoundError(),
        data: null,
      };
    }

    const {
      _sum: { contributionAmount },
    } = await this.prisma.planInvestment.aggregate({
      _sum: {
        contributionAmount: true,
      },
      where: {
        planId: plan.id,
      },
      /**
       * ! This can be a very expensive operation.
       *
       * Instead of calculating the balance on every claim, perhaps we could
       * create a property on the plan table called `balance` and update it
       * everytime that is a claim or investment. Since this is a scoped
       * application, we can leave it for now.
       */
    });

    const totalContributionAmount =
      (contributionAmount || 0) + plan.initialContributionAmount;

    // checking the balance of the plan
    // claimsSum can be null if there is no data
    const {
      _sum: { amount: sumClaimsAmount },
    } = await this.prisma.claim.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        planId: plan.id,
      },
      /**
       * ! This can be a very expensive operation.
       *
       * Instead of calculating the balance on every claim, perhaps we could
       * create a property on the plan table called `balance` and update it
       * everytime that is a claim or investment. Since this is a scoped
       * application, we can leave it for now.
       */
    });

    const balance = totalContributionAmount - (sumClaimsAmount || 0);

    if (claimDTO.claimAmount > balance) {
      return {
        error: new NotEnoughtBalanceError(),
        data: null,
      };
    }

    const isFirstClaim = sumClaimsAmount === null;

    /**
     * If is the first claim, we check the `product.initialNeedForRedemption` and now
     * if is not, we check the `product.waitingPeriodBetweenRedemptions` between the last claim and now
     */

    const now = new Date();

    if (isFirstClaim) {
      const hiringDatePlusDays = plan.hiringDate;

      hiringDatePlusDays.setDate(
        plan.hiringDate.getDate() + product.initialNeedForRedemption,
      );

      const canClaim = now > hiringDatePlusDays;

      if (!canClaim) {
        return {
          data: null,
          error: new ClaimBeforeInitialNeedForRedemptionError(),
        };
      }
    } else {
      const lastClaim = await this.prisma.claim.findFirst({
        where: {
          planId: plan.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      });

      const lastClaimDatePlusDays = lastClaim.createdAt;

      lastClaimDatePlusDays.setDate(
        lastClaimDatePlusDays.getDate() +
          product.waitingPeriodBetweenRedemptions,
      );

      const canClaim = now > lastClaimDatePlusDays;

      if (!canClaim) {
        return {
          data: null,
          error: new MustWaitBetweenClaimsError(),
        };
      }
    }

    const claim = await this.prisma.claim.create({
      data: {
        planId: plan.id,
        amount: claimDTO.claimAmount,
      },
    });

    const newBalance = balance - claimDTO.claimAmount;

    if (newBalance <= 0) {
      // cancel the plan if there isn't more balance
      await this.prisma.plan.update({
        where: {
          id: plan.id,
        },
        data: {
          canceledAt: new Date(),
        },
      });
    }

    return {
      data: claim,
      error: null,
    };
  }
}
