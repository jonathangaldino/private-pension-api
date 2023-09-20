import { faker } from '@faker-js/faker';
import { CreateClaimDTO, CreateClaimPtDTO } from '~/claim/dto/create-claim.dto';
import { ClaimEntity } from '~/claim/entities/claim.entity';
import { PlanEntity } from '~/plan/entities/plan.entity';
import { PrismaService } from '~/prisma.service';

export class ClaimFactory {
  static createClaimDTO(
    params?: Partial<CreateClaimDTO>,
    plan?: PlanEntity,
  ): CreateClaimDTO {
    return {
      planId: plan?.id || faker.string.uuid(),
      claimAmount: faker.number.int({
        min: 100,
        max: 1000,
      }),
      ...params,
    };
  }

  static createClaimPtDTO(
    params?: Partial<CreateClaimPtDTO>,
  ): CreateClaimPtDTO {
    return {
      idPlano: params?.idPlano || faker.string.uuid(),
      valorResgate: faker.number.int({
        min: 100,
        max: 1000,
      }),
      ...params,
    };
  }

  static async createClaimEntity(
    prisma: PrismaService,
    params?: Omit<Partial<ClaimEntity>, 'id'>,
  ): Promise<ClaimEntity> {
    const dto = this.createClaimDTO();

    const persistedClaim = await prisma.claim.create({
      data: {
        planId: params?.planId || dto.planId,
        amount: params?.amount || dto.claimAmount,
      },
    });

    return new ClaimEntity(persistedClaim);
  }
}
