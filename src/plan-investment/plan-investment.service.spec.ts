import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/prisma.service';
import { PlanInvestmentService } from './plan-investment.service';

describe('PlanInvestmentService', () => {
  let service: PlanInvestmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanInvestmentService, PrismaService],
    }).compile();

    service = module.get<PlanInvestmentService>(PlanInvestmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
