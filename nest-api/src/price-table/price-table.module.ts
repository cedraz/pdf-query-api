import { Module } from '@nestjs/common';
import { PriceTableService } from './price-table.service';
import { PriceTableController } from './price-table.controller';
import { RedisModule } from 'src/redis/redis.module';
import { LmStudioModule } from 'src/providers/lm-studio/lm-studio.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceTable, PriceTableSchema } from './schemas/price-table.schema';
import { DoclingModule } from 'src/providers/docling/docling.module';

@Module({
  controllers: [PriceTableController],
  providers: [PriceTableService],
  imports: [
    RedisModule,
    LmStudioModule,
    DoclingModule,
    MongooseModule.forFeature([
      { name: PriceTable.name, schema: PriceTableSchema },
    ]),
  ],
})
export class PriceTableModule {}
