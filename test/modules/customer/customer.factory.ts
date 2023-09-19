import { faker } from '@faker-js/faker';
import {
  CreateCustomerDTO,
  CreateCustomerPtDTO,
} from '~/customer/dto/create-customer.dto';
import { CustomerEntity } from '~/customer/entities/customer.entity';
import { PrismaService } from '~/prisma.service';

export class CustomerFactory {
  static createCustomerPtDTO(
    params?: Partial<CreateCustomerPtDTO>,
  ): CreateCustomerPtDTO {
    return {
      cpf: faker.string.numeric(11),
      nome: faker.person.firstName(),
      email: faker.internet.email(),
      dataDeNascimento: faker.date.past().toString(),
      genero: faker.helpers.arrayElement(['masculino', 'feminino']),
      rendaMensal: 2000.0,
      ...params,
    };
  }

  static createCustomerDTO(
    params?: Partial<CreateCustomerDTO>,
  ): CreateCustomerDTO {
    return {
      identity: faker.string.numeric(11),
      name: faker.person.firstName(),
      email: faker.internet.email(),
      dateOfBirth: faker.date.past().toString(),
      gender: faker.helpers.arrayElement(['masculino', 'feminino']),
      monthlyIncome: 2000.0,
      ...params,
    };
  }

  static async createCustomerEntity(
    prisma: PrismaService,
    customer?: Omit<CustomerEntity, 'id'>,
  ): Promise<CustomerEntity> {
    const dto = this.createCustomerDTO();

    const persistedCustomer = await prisma.customer.create({
      data: customer || {
        ...dto,
        dateOfBirth: new Date(dto.dateOfBirth),
      },
    });

    return new CustomerEntity(persistedCustomer);
  }
}
