import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { VerificationRequestModule } from 'src/verification-request/verification-request.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { MemberModule } from 'src/member/member.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    VerificationRequestModule,
    MailerModule,
    JobsModule,
    MemberModule,
    OrganizationModule,
    CaslModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
