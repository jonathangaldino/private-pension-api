import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIErrorResponse } from '~/core/controller.errors';
import {
  CreateCustomerPtDTO,
  CreateCustomerResponseDTO,
} from './dto/create-customer.dto';

export function CustomerSwaggerDecorators() {
  return applyDecorators(
    ApiTags('customers'),
    ApiBody({
      description: 'Create a customer',
      type: CreateCustomerPtDTO,
      required: true,
    }),
    // todo: put the error response as well
    ApiResponse({
      status: 201,
      description: 'The id of the customer.',
      type: CreateCustomerResponseDTO,
    }),
    ApiResponse({
      status: 400,
      description: `Multiple reasons:<br>
       - when there is a registered customer with the provided cpf;<br>
       - when there is a registered customer with the provided email.`,
      type: APIErrorResponse,
    }),
  );
}
