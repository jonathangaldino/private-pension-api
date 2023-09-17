import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreatePlanPtDTOSchema = z
  .object({
    idCliente: z.string(),
    idProduto: z.string(),
    aporte: z.number(),
    dataDaContratacao: z.string(),
    idadeDeAposentadoria: z.number(),
  })
  .required();

export class CreatePlanPtDTO {
  @ApiProperty()
  idCliente: string;

  @ApiProperty()
  idProduto: string;

  @ApiProperty()
  aporte: number;

  @ApiProperty()
  dataDaContratacao: string;

  @ApiProperty()
  idadeDeAposentadoria: number;
}

export class CreatePlanResponseDTO {
  @ApiProperty()
  id: string;
}

export class CreatePlanDTO {
  customerId: string;
  productId: string;
  initialContributionAmount: number;
  hiringDate: string;
  retirementAge: number;
}
