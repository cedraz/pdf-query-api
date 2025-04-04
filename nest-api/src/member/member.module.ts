import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { VerificationRequestModule } from 'src/verification-request/verification-request.module';

@Module({
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
  imports: [VerificationRequestModule],
})
export class MemberModule {}
