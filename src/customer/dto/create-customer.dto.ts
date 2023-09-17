import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

/**
 * Schema used to receive the request to create a customer.
 * !This should not be used to create a record in the database.
 */
export const CreateCustomerPtDTOSchema = z
  .object({
    cpf: z.string(),
    nome: z.string(),
    email: z.string(),
    dataDeNascimento: z.string(),
    genero: z.string(),
    rendaMensal: z.number(),
  })
  .required();

export class CreateCustomerPtDTO {
  @ApiProperty()
  cpf: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  dataDeNascimento: string;

  @ApiProperty()
  genero: string;

  @ApiProperty()
  rendaMensal: number;
}

export class CreateCustomerResponseDTO {
  @ApiProperty()
  id: string;
}

export class CreateCustomerDTO {
  identity: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  monthlyIncome: number;
}
