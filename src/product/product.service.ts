import { Injectable } from '@nestjs/common';
import { ServiceResponse } from 'src/core/interfaces/service.interfaces';
import { PrismaService } from 'src/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';

export type ProductServiceErrors = void;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDTO,
  ): Promise<ServiceResponse<ProductEntity, ProductServiceErrors>> {
    const persistedProduct = await this.prisma.product.create({
      data: createProductDto,
    });

    return {
      data: persistedProduct,
      error: null,
    };
  }
}
