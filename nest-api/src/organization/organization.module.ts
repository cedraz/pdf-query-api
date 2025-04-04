import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CloudinaryModule } from 'src/providers/cloudinary/cloudinary.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
  imports: [CloudinaryModule, MemberModule],
})
export class OrganizationModule {}
