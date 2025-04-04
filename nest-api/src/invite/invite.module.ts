import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [AuthModule],
})
export class InviteModule {}
