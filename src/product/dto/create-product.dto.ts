import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

/**
 * Schema used to receive the request to create a product.
 * !This should not be used to create a record in the database.
 */
export const CreateProductPtDTOSchema = z
  .object({
    nome: z.string(),
    susep: z.string(),
    expiracaoDeVenda: z.string(),
    valorMinimoAporteInicial: z
      .number()
      .min(0, `'valorMinimoAporteInicial' should be at least 0`), // valor mínimo de aporte no momento da contração
    valorMinimoAporteExtra: z
      .number()
      .min(0, { message: `'valorMinimoAporteExtra' should be at least zero.` }), // valor mínimo do aporte extra
    idadeDeEntrada: z.number().min(0, `The minimum age is 0`), // idade mínima para comprar o produto
    idadeDeSaida: z.number().min(0, `The maximum age is 0`), // idade máxima para começar a usufruir do benefício
    carenciaInicialDeResgate: z.number(), // em dias - carência para realizar o primeiro resgate
    carenciaEntreResgates: z.number(), // em dias - carência para realizar outro resgate após
  })
  .required()
  .refine(({ idadeDeEntrada, idadeDeSaida }) => idadeDeSaida > idadeDeEntrada, {
    message: `'idadeDeSaida' should be greather than 'idadeDeEntrada'`,
  });

export class CreateProductPtDTO {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  susep: string;

  @ApiProperty()
  expiracaoDeVenda: string;

  @ApiProperty()
  valorMinimoAporteInicial: number;

  @ApiProperty()
  valorMinimoAporteExtra: number;

  @ApiProperty()
  idadeDeEntrada: number;

  @ApiProperty()
  idadeDeSaida: number;

  @ApiProperty()
  carenciaInicialDeResgate: number;

  @ApiProperty()
  carenciaEntreResgates: number;
}

export class CreateProductDTO {
  susep: string;
  saleExpiration: string;
  minimumInitialContributionAmount: number;
  minimumExtraContributionAmount: number;
  minEntryAge: number; // age like
  maxEntryAge: number; // age like
  initialNeedForRedemption: number; // in days
  waitingPeriodBetweenRedemptions: number; // in days
}
