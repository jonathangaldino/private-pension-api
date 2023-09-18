import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from '~/core/pipes/ZodValidationPipe';
import { CustomerNotFoundError } from '~/customer/customer.errors';
import { PlanNotFoundError } from '~/plan/plan.errors';
import { ProductNotFoundError } from '~/product/product.errors';
import {
  CreatePlanInvesmentPtDTO,
  CreatePlanInvestmentDTO,
  CreatePlanInvestmentPtDTOSchema,
} from './dto/create-plan-investment.dto';
import { PlanInvestmentSwaggerDecorators } from './plan-investment.decorators';
import { MinimumExtraContributionAmountError } from './plan-investment.errors';
import { PlanInvestmentService } from './plan-investment.service';

@Controller('plans-investment')
export class PlanInvestmentController {
  constructor(private readonly planInvestmentService: PlanInvestmentService) {}

  @PlanInvestmentSwaggerDecorators()
  @Post()
  @UsePipes(new ZodValidationPipe(CreatePlanInvestmentPtDTOSchema))
  async create(
    @Body() ptbrDTO: CreatePlanInvesmentPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createPlanInvestmentDTO: CreatePlanInvestmentDTO = {
      customerId: ptbrDTO.idCliente,
      contributionAmount: ptbrDTO.valorAporte,
      planId: ptbrDTO.idPlano,
    };

    const { error, data: planInvestment } =
      await this.planInvestmentService.create(createPlanInvestmentDTO);

    if (
      error instanceof CustomerNotFoundError ||
      error instanceof PlanNotFoundError ||
      error instanceof ProductNotFoundError
    ) {
      return response.code(404).send({ error: error.message });
    }

    if (error instanceof MinimumExtraContributionAmountError) {
      return response.code(400).send({ error: error.message });
    }

    return response.code(201).send({
      id: planInvestment.id,
    });
  }
}
