import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIErrorResponse } from '~/core/controller.errors';
import { CreatePlanPtDTO, CreatePlanResponseDTO } from './dto/create-plan.dto';

export function PlansSwaggerDecorators() {
  return applyDecorators(
    ApiTags('plans'),
    ApiBody({
      description: 'Hire a private pension plan.',
      type: CreatePlanPtDTO,
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: `The plan is hired.`,
      type: CreatePlanResponseDTO,
    }),
    ApiResponse({
      status: 404,
      description: `Multiple reasons:<br>
      - when the product is not found;<br>
      - when the customer is not found.`,
      type: APIErrorResponse,
    }),
    ApiResponse({
      status: 400,
      description: `Multiple reasons: <br>
      - when the hiring date is after the end of the sale of the product; <br>
      - when the retirement age is not within the range of the product; <br>
      - when the contribution value is lower then the required by the plan;<br>
      - when the hiring date is invalid or incorrect.`,
      type: APIErrorResponse,
    }),
    ApiResponse({
      status: 409,
      description: `When the plan was already hired by this customer.`,
      type: APIErrorResponse,
    }),
  );
}
