import { Module } from '@nestjs/common';
import { PrismaService } from '~/prisma.service';
import { ClaimController } from './claim.controller';
import { ClaimService } from './claim.service';

@Module({
  controllers: [ClaimController],
  providers: [ClaimService, PrismaService],
})
export class ClaimModule {}
