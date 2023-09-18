import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ZodValidationPipe } from '~/core/pipes/ZodValidationPipe';
import { CustomerSwaggerDecorators } from './customer.decorators';
import {
  DuplicatedFieldsError,
  InvalidDateOfBirthError,
} from './customer.errors';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDTO,
  CreateCustomerPtDTO,
  CreateCustomerPtDTOSchema,
} from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @CustomerSwaggerDecorators()
  @Post()
  @UsePipes(new ZodValidationPipe(CreateCustomerPtDTOSchema))
  async create(
    @Body() ptbrDTO: CreateCustomerPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createCustomerDTO: CreateCustomerDTO = {
      identity: ptbrDTO.cpf,
      email: ptbrDTO.email,
      dateOfBirth: ptbrDTO.dataDeNascimento,
      gender: ptbrDTO.genero,
      name: ptbrDTO.nome,
      monthlyIncome: ptbrDTO.rendaMensal,
    };

    const { error, data: customer } =
      await this.customerService.create(createCustomerDTO);

    if (error instanceof DuplicatedFieldsError) {
      return response
        .code(400)
        .send({ error: `'cpf' or 'email' is duplicated.` });
    }

    if (error instanceof InvalidDateOfBirthError) {
      return response.code(400).send({
        error: `'dataDeNascimento' is invalid. Expected DateTime with timezone.`,
      });
    }

    return response.code(201).send({
      id: customer.id,
    });
  }
}
