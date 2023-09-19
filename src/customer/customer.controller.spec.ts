import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import { CustomerModule } from './customer.module';

describe('CustomerController', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomerModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /customers - should return 201 created', async () => {
    const body = CustomerFactory.createCustomerPtDTO();

    return app
      .inject({
        method: 'POST',
        url: '/customers',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(JSON.parse(res.body)).toHaveProperty('id', expect.any(String));
      });
  });

  it('POST /customers - should return 400 when identity fields are duplicated', async () => {
    const body = CustomerFactory.createCustomerPtDTO();

    // create the first time
    await app.inject({
      method: 'POST',
      url: '/customers',
      body,
    });

    // create the second time
    return app
      .inject({
        method: 'POST',
        url: '/customers',
        body,
      })
      .then((res) => {
        expect(res.statusCode).toEqual(400);
      });
  });
});
