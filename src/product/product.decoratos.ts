import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { APIErrorResponse } from '~/core/controller.errors';
import {
  CreateProductPtDTO,
  CreateProductResponseDTO,
} from './dto/create-product.dto';

export function ProductsSwaggerDecorators() {
  return applyDecorators(
    ApiTags('products'),
    ApiBody({
      description: 'Create a product.',
      type: CreateProductPtDTO,
      required: true,
    }),
    ApiResponse({
      status: 201,
      description: 'The id of the product.',
      type: CreateProductResponseDTO,
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid expiracaoDeVenda - expected DateTime with timezone.',
      type: APIErrorResponse,
    }),
  );
}
