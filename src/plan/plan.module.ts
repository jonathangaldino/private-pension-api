import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService, PrismaService],
})
export class PlanModule {}
