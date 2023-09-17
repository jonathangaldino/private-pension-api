import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import {
  CreateProductDTO,
  CreateProductPtDTO,
  CreateProductPtDTOSchema,
} from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('products')
  @ApiBody({
    description: 'Create a product',
    type: [CreateProductPtDTO],
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

    const { data: product } =
      await this.productService.create(createProductDTO);

    return response.code(201).send({
      id: product.id,
    });
  }
}
