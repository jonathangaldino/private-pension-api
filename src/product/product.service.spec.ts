import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/prisma.service';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { ProductEntity } from './entities/product.entity';
import { InvalidSaleExpirationDateError } from './product.errors';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return InvalidSaleExpirationDateError if saleExpirations is an invalid Date', async () => {
    const DTO = ProductFactory.createProductDTO();

    const { error, data } = await service.create({
      ...DTO,
      saleExpiration: 'Wrong-Date',
    });

    expect(data).toBeNull();
    expect(error).toBeInstanceOf(InvalidSaleExpirationDateError);
  });

  it('should return a Product Entity', async () => {
    const DTO = ProductFactory.createProductDTO();

    const { error, data } = await service.create(DTO);

    expect(error).toBeNull();
    expect(data).toBeInstanceOf(ProductEntity);
  });
});
