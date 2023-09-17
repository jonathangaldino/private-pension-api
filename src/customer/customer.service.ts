import { Injectable } from '@nestjs/common';
import { isDateValid } from 'src/core/helpers/dateParser';
import { ServiceResponse } from 'src/core/interfaces/service.interfaces';
import { PrismaService } from 'src/prisma.service';
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
    const duplicatedCustomers = await this.prisma.customer.findMany({
      where: {
        OR: [{ email: customer.email, identity: customer.identity }],
      },
    });

    if (!isDateValid(customer.dateOfBirth)) {
      return {
        error: new InvalidDateOfBirthError(),
        data: null,
      };
    }

    const dob = new Date(customer.dateOfBirth);

    if (duplicatedCustomers.length) {
      return {
        error: new DuplicatedFieldsError(),
        data: null,
      };
    }

    const persistedCustomer = await this.prisma.customer.create({
      data: {
        ...customer,
        dateOfBirth: dob,
      },
    });

    return {
      data: persistedCustomer,
      error: null,
    };
  }
}
