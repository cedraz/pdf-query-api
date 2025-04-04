import { Test, TestingModule } from '@nestjs/testing';
import { DoclingService } from './docling.service';

describe('DoclingService', () => {
  let service: DoclingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoclingService],
    }).compile();

    service = module.get<DoclingService>(DoclingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
