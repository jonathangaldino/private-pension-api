import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const CreateClaimPtDTOSchema = z
  .object({
    idPlano: z.string(),
    valorResgate: z.number(),
  })
  .required();

export class CreateClaimPtDTO {
  @ApiProperty()
  idPlano: string;

  @ApiProperty()
  valorResgate: number;
}

export class CreateClaimResponseDTO {
  @ApiProperty()
  id: string;
}

export class CreateClaimDTO {
  planId: string;
  claimAmount: number;
}
