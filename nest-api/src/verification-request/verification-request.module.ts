import { Module } from '@nestjs/common';
import { VerificationRequestService } from './verification-request.service';
import { VerificationRequestController } from './verification-request.controller';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  providers: [VerificationRequestService],
  exports: [VerificationRequestService],
  controllers: [VerificationRequestController],
  imports: [JobsModule],
})
export class VerificationRequestModule {}
