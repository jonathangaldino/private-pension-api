import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';

import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import { DuplicatedFieldsError } from './customer.errors';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDTO,
  CreateCustomerPtDTO,
  CreateCustomerPtDTOSchema,
  CreateCustomerResponseDTO,
} from './dto/create-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @ApiTags('customers')
  @ApiBody({
    description: 'Create a customer',
    type: [CreateCustomerPtDTO],
  })
  // todo: put the error response as well
  @ApiResponse({
    status: 201,
    description: 'The id of the customer.',
    type: CreateCustomerResponseDTO,
  })
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
        .send({ error: `'cpf' and/or 'email' is duplicated.` });
    }

    return response.code(201).send({
      id: customer.id,
    });
  }
}
