import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreatePlanInvestmentPtDTOSchema = z
  .object({
    idCliente: z.string(),
    idPlano: z.string(),
    valorAporte: z.number(),
  })
  .required();

export class CreatePlanInvesmentPtDTO {
  @ApiProperty()
  idCliente: string;

  @ApiProperty()
  idPlano: string;

  @ApiProperty()
  valorAporte: number;
}

export class CreatePlanInvesmentResponseDTO {
  @ApiProperty()
  id: string;
}

export class CreatePlanInvestmentDTO {
  customerId: string;
  planId: string;
  contributionAmount: number;
}
