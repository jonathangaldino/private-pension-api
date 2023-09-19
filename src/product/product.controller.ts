import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from '~/core/pipes/ZodValidationPipe';
import {
  CreateProductDTO,
  CreateProductPtDTO,
  CreateProductPtDTOSchema,
} from './dto/create-product.dto';
import { ProductsSwaggerDecorators } from './product.decoratos';
import { InvalidSaleExpirationDateError } from './product.errors';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ProductsSwaggerDecorators()
  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductPtDTOSchema))
  async create(
    @Body() ptbrDTO: CreateProductPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createProductDTO: CreateProductDTO = {
      susep: ptbrDTO.susep,
      name: ptbrDTO.nome,
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
