import { Injectable } from '@nestjs/common';
import { isDateValid } from 'src/core/helpers/dateParser';
import { ServiceResponse } from 'src/core/interfaces/service.interfaces';
import { CustomerNotFoundError } from 'src/customer/customer.errors';
import { PrismaService } from 'src/prisma.service';
import { ProductNotFoundError } from 'src/product/product.errors';
import { CreatePlanDTO } from './dto/create-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import {
  AlreadyHiredPlanError,
  HiringDateAfterExpirationDateError,
  InvalidHiringDateError,
  InvalidMinimumInitialContributionAmountError,
  InvalidRetirementAgeError,
} from './plan.errors';

export type PlanServiceErrors =
  | CustomerNotFoundError
  | InvalidMinimumInitialContributionAmountError
  | InvalidRetirementAgeError
  | AlreadyHiredPlanError
  | HiringDateAfterExpirationDateError
  | InvalidHiringDateError;

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPlanDTO: CreatePlanDTO,
  ): Promise<ServiceResponse<PlanEntity, PlanServiceErrors>> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id: createPlanDTO.customerId,
      },
    });

    if (!customer) {
      return {
        error: new CustomerNotFoundError(),
        data: null,
      };
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: createPlanDTO.productId,
      },
    });

    if (!product) {
      return {
        error: new ProductNotFoundError(),
        data: null,
      };
    }

    // verify the hiring date
    if (!isDateValid(createPlanDTO.hiringDate)) {
      return {
        error: new InvalidHiringDateError(),
        data: null,
      };
    }

    const isHiringDateAfterSaleExpirationDate =
      new Date(createPlanDTO.hiringDate) > product.saleExpiration;

    if (isHiringDateAfterSaleExpirationDate) {
      return {
        error: new HiringDateAfterExpirationDateError(),
        data: null,
      };
    }

    // verify if the initial contribution amount
    if (
      createPlanDTO.initialContributionAmount <
      product.minimumInitialContributionAmount
    ) {
      return {
        error: new InvalidMinimumInitialContributionAmountError(),
        data: null,
      };
    }

    const isAgeRetirementAgeWithinRange =
      product.minEntryAge <= createPlanDTO.retirementAge &&
      createPlanDTO.retirementAge <= product.maxEntryAge;

    // verify if the age is within the range: minEntryAge < age < maxEntryAge
    if (!isAgeRetirementAgeWithinRange) {
      return {
        error: new InvalidRetirementAgeError(),
        data: null,
      };
    }

    // check if this plan was already hired for this customer
    const hasPlan = await this.prisma.plan.findFirst({
      where: {
        customerId: createPlanDTO.customerId,
        productId: createPlanDTO.productId,
      },
    });

    if (hasPlan) {
      return {
        error: new AlreadyHiredPlanError(),
        data: null,
      };
    }

    // hire the plan
    const plan = await this.prisma.plan.create({
      data: createPlanDTO,
    });

    return {
      data: plan,
      error: null,
    };
  }
}
