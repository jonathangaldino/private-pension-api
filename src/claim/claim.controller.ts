import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ZodValidationPipe } from 'src/core/pipes/ZodValidationPipe';
import { PlanNotFoundError } from 'src/plan/plan.errors';
import { ProductNotFoundError } from 'src/product/product.errors';
import { ClaimsSwaggerDecorators } from './claim.decorators';
import {
  ClaimBeforeInitialNeedForRedemptionError,
  MustWaitBetweenClaimsError,
  NotEnoughtBalanceError,
} from './claim.errors';
import { ClaimService } from './claim.service';
import {
  CreateClaimDTO,
  CreateClaimPtDTO,
  CreateClaimPtDTOSchema,
} from './dto/create-claim.dto';

@Controller('claims')
export class ClaimController {
  constructor(private readonly claimService: ClaimService) {}

  @ClaimsSwaggerDecorators()
  @Post()
  @UsePipes(new ZodValidationPipe(CreateClaimPtDTOSchema))
  async create(
    @Body() ptbrDTO: CreateClaimPtDTO,
    @Res() response: FastifyReply,
  ) {
    const createClaimDTO: CreateClaimDTO = {
      claimAmount: ptbrDTO.valorResgate,
      planId: ptbrDTO.idPlano,
    };

    const { error, data: claim } =
      await this.claimService.create(createClaimDTO);

    if (
      error instanceof PlanNotFoundError ||
      error instanceof ProductNotFoundError
    ) {
      return response.code(404).send({ error: error.message });
    }

    if (
      error instanceof ClaimBeforeInitialNeedForRedemptionError ||
      error instanceof MustWaitBetweenClaimsError ||
      error instanceof NotEnoughtBalanceError
    ) {
      return response.code(409).send({ error: error.message });
    }

    return response.code(201).send({
      id: claim.id,
    });
  }
}
