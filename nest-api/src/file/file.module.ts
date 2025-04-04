import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { LmStudioModule } from 'src/providers/lm-studio/lm-studio.module';
import { DoclingModule } from 'src/providers/docling/docling.module';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
  imports: [LmStudioModule, DoclingModule],
})
export class FileModule {}
