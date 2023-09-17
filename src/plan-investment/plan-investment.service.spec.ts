import { Test, TestingModule } from '@nestjs/testing';
import { PlanInvestmentService } from './plan-investment.service';

describe('PlanInvestmentService', () => {
  let service: PlanInvestmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanInvestmentService],
    }).compile();

    service = module.get<PlanInvestmentService>(PlanInvestmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
