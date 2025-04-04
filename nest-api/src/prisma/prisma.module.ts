import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JobsModule } from 'src/jobs/jobs.module';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [JobsModule],
})
export class PrismaModule {}
