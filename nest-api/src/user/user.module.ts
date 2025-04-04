import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { VerificationRequestService } from 'src/verification-request/verification-request.service';
import { VerificationRequestModule } from 'src/verification-request/verification-request.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { ViaCepModule } from 'src/providers/via-cep/via-cep.module';
import { CloudinaryModule } from 'src/providers/cloudinary/cloudinary.module';

@Module({
  controllers: [UserController],
  providers: [UserService, VerificationRequestService],
  exports: [UserService],
  imports: [
    VerificationRequestModule,
    JobsModule,
    ViaCepModule,
    CloudinaryModule,
  ],
})
export class UserModule {}
