import { faker } from '@faker-js/faker';
import { PrismaService } from '~/prisma.service';
import {
  CreateProductDTO,
  CreateProductPtDTO,
} from '~/product/dto/create-product.dto';
import { ProductEntity } from '~/product/entities/product.entity';

export class ProductFactory {
  static createProductDTO(
    params?: Partial<CreateProductDTO>,
  ): CreateProductDTO {
    return {
      name: faker.commerce.productName(),
      susep: faker.string.numeric({ length: 17 }),
      saleExpiration: faker.date.future({ years: 1 }).toString(),
      minimumInitialContributionAmount: Number(
        faker.finance.amount({
          dec: 0,
          max: 200,
          min: 100,
        }),
      ),
      minimumExtraContributionAmount: Number(
        faker.finance.amount({
          dec: 0,
          max: 1000,
          min: 201,
        }),
      ),
      initialNeedForRedemption: Number(
        faker.finance.amount({
          dec: 0,
          max: 30,
          min: 10,
        }),
      ),
      waitingPeriodBetweenRedemptions: Number(
        faker.finance.amount({
          dec: 0,
          max: 30,
          min: 15,
        }),
      ),
      minEntryAge: 18,
      maxEntryAge: 60,
      ...params,
    };
  }

  static createProductPtDTO(
    params?: Partial<CreateProductPtDTO>,
  ): CreateProductPtDTO {
    return {
      nome: faker.commerce.productName(),
      susep: faker.string.numeric({ length: 17 }),
      expiracaoDeVenda: faker.date.future({ years: 1 }).toString(),
      valorMinimoAporteInicial: Number(
        faker.finance.amount({
          dec: 0,
          max: 200,
          min: 100,
        }),
      ),
      valorMinimoAporteExtra: Number(
        faker.finance.amount({
          dec: 0,
          max: 1000,
          min: 201,
        }),
      ),
      carenciaInicialDeResgate: Number(
        faker.finance.amount({
          dec: 0,
          max: 30,
          min: 10,
        }),
      ),
      carenciaEntreResgates: Number(
        faker.finance.amount({
          dec: 0,
          max: 30,
          min: 15,
        }),
      ),
      idadeDeEntrada: 18,
      idadeDeSaida: 60,
      ...params,
    };
  }

  static async createProductEntity(
    prisma: PrismaService,
    product?: Omit<ProductEntity, 'id'>,
    params?: Partial<ProductEntity>,
  ): Promise<ProductEntity> {
    const dto = this.createProductDTO();

    const persistedProduct = await prisma.product.create({
      data: product || {
        ...dto,
        saleExpiration: new Date(dto.saleExpiration),
        ...params,
      },
    });

    return new ProductEntity(persistedProduct);
  }
}
