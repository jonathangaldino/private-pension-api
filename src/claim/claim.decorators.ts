import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIErrorResponse } from 'src/core/controller.errors';
import {
  CreateClaimPtDTO,
  CreateClaimResponseDTO,
} from './dto/create-claim.dto';

export function ClaimsSwaggerDecorators() {
  return applyDecorators(
    ApiTags('claims'),
    ApiBody({
      description: 'Claim an amount from the plan.',
      type: CreateClaimPtDTO,
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: 'The id of the claim.',
      type: CreateClaimResponseDTO,
    }),
    ApiResponse({
      status: 404,
      description: `Multiple reasons:<br>
       - when the plan does not exists;<br>
       - when the product does not exists`,
      type: APIErrorResponse,
    }),
    ApiResponse({
      status: 409,
      description: `Multiple reasons: <br>
       - when the claim is happening before the initial need for redemption date;<br>
       - when the comparison of dates of the last claim and the new attempt of claim doesnt match the required time between claims setuped at the product;<br>
       - when there isnt enough balance to claim.`,
      type: APIErrorResponse,
    }),
  );
}
