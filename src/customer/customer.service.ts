import { Injectable } from '@nestjs/common';
import { isDateValid } from '~/core/helpers/dateParser';
import { ServiceResponse } from '~/core/interfaces/service.interfaces';
import { PrismaService } from '~/prisma.service';
import {
  DuplicatedFieldsError,
  InvalidDateOfBirthError,
} from './customer.errors';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

export type CustomerServiceErrors =
  | DuplicatedFieldsError
  | InvalidDateOfBirthError;

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(
    customer: CreateCustomerDTO,
  ): Promise<ServiceResponse<CustomerEntity, CustomerServiceErrors>> {
    if (!isDateValid(customer.dateOfBirth)) {
      return {
        error: new InvalidDateOfBirthError(),
        data: null,
      };
    }

    const duplicatedCustomers = await this.prisma.customer.findMany({
      where: {
        OR: [{ email: customer.email }, { identity: customer.identity }],
      },
    });

    if (duplicatedCustomers.length) {
      return {
        error: new DuplicatedFieldsError(),
        data: null,
      };
    }

    const dob = new Date(customer.dateOfBirth);

    const persistedCustomer = await this.prisma.customer.create({
      data: {
        ...customer,
        dateOfBirth: dob,
      },
    });

    const customerEntity = new CustomerEntity(persistedCustomer);

    return {
      data: customerEntity,
      error: null,
    };
  }
}
