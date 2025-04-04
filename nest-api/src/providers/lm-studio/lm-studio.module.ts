import { Module } from '@nestjs/common';
import { LmStudioService } from './lm-studio.service';

@Module({
  providers: [LmStudioService],
  exports: [LmStudioService],
})
export class LmStudioModule {}
