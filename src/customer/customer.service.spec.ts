import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/prisma.service';
import { CustomerFactory } from '../../test/modules/customer/customer.factory';
import {
  DuplicatedFieldsError,
  InvalidDateOfBirthError,
} from './customer.errors';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  const prisma = new PrismaService();

  const randomDto: CreateCustomerDTO = CustomerFactory.createCustomerDTO();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, PrismaService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return InvalidDateOfBirthError', async () => {
    const { error } = await service.create({
      ...randomDto,
      dateOfBirth: 'not-even-a-date',
    });

    expect(error).toBeInstanceOf(InvalidDateOfBirthError);
  });

  it('should return DuplicatedFieldsError when the email is already registered', async () => {
    await prisma.customer.create({
      data: {
        ...randomDto,
        identity: '12312312312',
        dateOfBirth: new Date(randomDto.dateOfBirth),
      },
    });

    const { error } = await service.create(randomDto);

    expect(error).toBeInstanceOf(DuplicatedFieldsError);
  });

  it('should return DuplicatedFieldsError when the identity is already registered', async () => {
    await prisma.customer.create({
      data: {
        ...randomDto,
        email: 'different@email.com',
        dateOfBirth: new Date(randomDto.dateOfBirth),
      },
    });

    const { error } = await service.create(randomDto);

    expect(error).toBeInstanceOf(DuplicatedFieldsError);
  });

  it('should create the customer', async () => {
    const { data, error } = await service.create(
      CustomerFactory.createCustomerDTO(),
    );

    expect(error).toBeNull();
    expect(data).toBeInstanceOf(CustomerEntity);
  });
});
