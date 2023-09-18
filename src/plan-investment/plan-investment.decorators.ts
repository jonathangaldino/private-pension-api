import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIErrorResponse } from '~/core/controller.errors';
import {
  CreatePlanInvesmentPtDTO,
  CreatePlanInvesmentResponseDTO,
} from './dto/create-plan-investment.dto';

export function PlanInvestmentSwaggerDecorators() {
  return applyDecorators(
    ApiTags('plans-investment'),
    ApiBody({
      description: 'Invest in a plan.',
      type: CreatePlanInvesmentPtDTO,
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: 'Investment was done.',
      type: CreatePlanInvesmentResponseDTO,
    }),
    ApiResponse({
      status: 400,
      description: `When the amount of the contribution is lower than the minimum amount of the product.`,
      type: APIErrorResponse,
    }),
    ApiResponse({
      status: 404,
      description: `Multiple reasons:<br>
      - when the customer does not exists;<br>
      - when the plan does not exists;<br>
      - when the product does not exists.`,
      type: APIErrorResponse,
    }),
  );
}
