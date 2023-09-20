import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { ProductFactory } from '../../test/modules/product/product.factory';
import { ProductModule } from './product.module';

describe('ProductController', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /products - should return 400', async () => {
    const body = ProductFactory.createProductPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/products',
        body: {
          ...body,
          expiracaoDeVenda: 'non-date',
        },
      })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
      });
  });

  it('POST /products - should return 201 created', async () => {
    const body = ProductFactory.createProductPtDTO();

    // create the second time
    return app
      .inject({
        method: 'POST',
        url: '/products',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(JSON.parse(res.body)).toHaveProperty('id', expect.any(String));
      });
  });
});
