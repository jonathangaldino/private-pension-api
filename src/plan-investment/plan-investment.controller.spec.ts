import { Test, TestingModule } from '@nestjs/testing';
import { PlanInvestmentController } from './plan-investment.controller';
import { PlanInvestmentService } from './plan-investment.service';

describe('PlanInvestmentController', () => {
  let controller: PlanInvestmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanInvestmentController],
      providers: [PlanInvestmentService],
    }).compile();

    controller = module.get<PlanInvestmentController>(PlanInvestmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
