import { Injectable } from '@nestjs/common';
import { ServiceResponse } from 'src/core/interfaces/service.interfaces';
import { PrismaService } from 'src/prisma.service';
import { DuplicatedFieldsError } from './customer.errors';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

export type CustomerServiceErrors = DuplicatedFieldsError;

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

    if (duplicatedCustomers.length) {
      return {
        error: new DuplicatedFieldsError(),
        data: null,
      };
    }

    const persistedCustomer = await this.prisma.customer.create({
      data: customer,
    });

    return {
      data: persistedCustomer,
      error: null,
    };
  }
}
