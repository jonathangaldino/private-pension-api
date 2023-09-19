import { faker } from '@faker-js/faker';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { CreatePlanDTO } from '~/plan/dto/create-plan.dto';
import { ProductEntity } from '~/product/entities/product.entity';

export class PlanFactory {
  static createPlanDTO(
    customer?: CustomerEntity,
    product?: ProductEntity,
    params?: Partial<CreatePlanDTO>,
  ): CreatePlanDTO {
    return {
      customerId: customer?.id || faker.string.uuid(),
      productId: product?.id || faker.string.uuid(),
      hiringDate: faker.date.recent({ days: 10 }).toString(),
      retirementAge: faker.number.int({ min: 5, max: 100 }),
      initialContributionAmount: faker.number.int({ min: 200, max: 1000 }),
      ...params,
    };
  }
}
