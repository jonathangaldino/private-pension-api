import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { APIErrorResponse } from 'src/core/controller.errors';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import {
  CreateProductDTO,
  CreateProductPtDTO,
  CreateProductPtDTOSchema,
  CreateProductResponseDTO,
} from './dto/create-product.dto';
import { InvalidSaleExpirationDateError } from './product.errors';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('products')
  @ApiBody({
    description: 'Create a product.',
    type: CreateProductPtDTO,
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'The id of the product.',
    type: CreateProductResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid expiracaoDeVenda - expected DateTime with timezone.',
    type: APIErrorResponse,
  })
  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductPtDTOSchema))
  async create(
    @Body() ptbrDTO: CreateProductPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createProductDTO: CreateProductDTO = {
      susep: ptbrDTO.susep,
      saleExpiration: ptbrDTO.expiracaoDeVenda,
      minimumInitialContributionAmount: ptbrDTO.valorMinimoAporteInicial,
      minimumExtraContributionAmount: ptbrDTO.valorMinimoAporteExtra,
      initialNeedForRedemption: ptbrDTO.carenciaInicialDeResgate,
      waitingPeriodBetweenRedemptions: ptbrDTO.carenciaEntreResgates,
      minEntryAge: ptbrDTO.idadeDeEntrada,
      maxEntryAge: ptbrDTO.idadeDeSaida,
    };

    const { error, data: product } =
      await this.productService.create(createProductDTO);

    if (error instanceof InvalidSaleExpirationDateError) {
      return response.code(400).send({ error: error.message });
    }

    return response.code(201).send({
      id: product.id,
    });
  }
}
