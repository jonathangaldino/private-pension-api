import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { APIErrorResponse } from 'src/core/controller.errors';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import { CustomerNotFoundError } from 'src/customer/customer.errors';
import { ProductNotFoundError } from 'src/product/product.errors';
import {
  CreatePlanDTO,
  CreatePlanPtDTO,
  CreatePlanPtDTOSchema,
  CreatePlanResponseDTO,
} from './dto/create-plan.dto';
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

  @ApiTags('plans')
  @ApiBody({
    description: 'Hire a private pension plan.',
    type: CreatePlanPtDTO,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: `The plan is hired.`,
    type: CreatePlanResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: `Multiple reasons:
      when the product is not found;
      when the customer is not found.`,
    type: APIErrorResponse,
  })
  @ApiResponse({
    status: 400,
    description: `Multiple reasons: 
      when the hiring date is after the end of the sale of the product; 
      when the retirement age is not within the range of the product; 
      when the contribution value is lower then the required by the plan;
      when the hiring date is invalid or incorrect.`,
    type: APIErrorResponse,
  })
  @ApiResponse({
    status: 409,
    description: `When the plan was already hired by this customer.`,
    type: APIErrorResponse,
  })
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
