import { Injectable } from '@nestjs/common';
import { isDateValid } from '~/core/helpers/dateParser';
import { ServiceResponse } from '~/core/interfaces/service.interfaces';
import { PrismaService } from '~/prisma.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InvalidSaleExpirationDateError } from './product.errors';

export type ProductServiceErrors = InvalidSaleExpirationDateError;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDTO,
  ): Promise<ServiceResponse<ProductEntity, ProductServiceErrors>> {
    if (!isDateValid(createProductDto.saleExpiration)) {
      return {
        error: new InvalidSaleExpirationDateError(),
        data: null,
      };
    }

    const saleExpirationDate = new Date(createProductDto.saleExpiration);

    const persistedProduct = await this.prisma.product.create({
      data: {
        ...createProductDto,
        saleExpiration: saleExpirationDate,
      },
    });

    return {
      data: persistedProduct,
      error: null,
    };
  }
}
