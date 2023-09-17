import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PlanInvestmentController } from './plan-investment.controller';
import { PlanInvestmentService } from './plan-investment.service';

@Module({
  controllers: [PlanInvestmentController],
  providers: [PlanInvestmentService, PrismaService],
})
export class PlanInvestmentModule {}
