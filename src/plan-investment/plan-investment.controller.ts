import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { APIErrorResponse } from 'src/core/controller.errors';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import { CustomerNotFoundError } from 'src/customer/customer.errors';
import { PlanNotFoundError } from 'src/plan/plan.errors';
import { ProductNotFoundError } from 'src/product/product.errors';
import {
  CreatePlanInvesmentPtDTO,
  CreatePlanInvesmentResponseDTO,
  CreatePlanInvestmentDTO,
  CreatePlanInvestmentPtDTOSchema,
} from './dto/create-plan-investment.dto';
import { MinimumExtraContributionAmountError } from './plan-investment.errors';
import { PlanInvestmentService } from './plan-investment.service';

@Controller('plans-investment')
export class PlanInvestmentController {
  constructor(private readonly planInvestmentService: PlanInvestmentService) {}

  @ApiTags('plans-investment')
  @ApiBody({
    description: 'Invest in a plan.',
    type: CreatePlanInvesmentPtDTO,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Investment was done.',
    type: CreatePlanInvesmentResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: `When the amount of the contribution is lower than the minimum amount of the product.`,
    type: APIErrorResponse,
  })
  @ApiResponse({
    status: 404,
    description: `Multiple reasons:
      when the customer does not exists;
      when the plan does not exists;
      when the product does not exists.`,
    type: APIErrorResponse,
  })
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
