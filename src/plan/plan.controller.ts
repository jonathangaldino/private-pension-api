import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from '~/core/pipes/ZodValidationPipe';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { ProductNotFoundError } from '~/product/product.errors';
import {
  CreatePlanDTO,
  CreatePlanPtDTO,
  CreatePlanPtDTOSchema,
} from './dto/create-plan.dto';
import { PlansSwaggerDecorators } from './plan.decorators';
import {
  AlreadyHiredPlanError,
  HiringDateAfterExpirationDateError,
  InvalidHiringDateError,
  InvalidMinimumInitialContributionAmountError,
  InvalidRetirementAgeError,
} from './plan.errors';
import { PlanService } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @PlansSwaggerDecorators()
  @UsePipes(new ZodValidationPipe(CreatePlanPtDTOSchema))
  @Post()
  async create(
    @Body() ptbrDTO: CreatePlanPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createPlanDTO: CreatePlanDTO = {
      customerId: ptbrDTO.idCliente,
      productId: ptbrDTO.idProduto,
      hiringDate: ptbrDTO.dataDaContratacao,
      initialContributionAmount: ptbrDTO.aporte,
      retirementAge: ptbrDTO.idadeDeAposentadoria,
    };

    const { error, data: plan } = await this.planService.create(createPlanDTO);

    if (
      error instanceof CustomerNotFoundError ||
      error instanceof ProductNotFoundError
    ) {
      return response.code(404).send({ error: error.message });
    }

    if (
      error instanceof InvalidMinimumInitialContributionAmountError ||
      error instanceof InvalidRetirementAgeError ||
      error instanceof HiringDateAfterExpirationDateError ||
      error instanceof InvalidHiringDateError
    ) {
      return response.code(400).send({ error: error.message });
    }

    if (error instanceof AlreadyHiredPlanError) {
      return response.code(409).send({ error: error.message });
    }

    return response.code(201).send({ id: plan.id });
  }
}
