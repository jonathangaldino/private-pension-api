import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '~/prisma.service';
import { ClaimService } from './claim.service';

describe('ClaimService', () => {
  let service: ClaimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaimService, PrismaService],
    }).compile();

    service = module.get<ClaimService>(ClaimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
