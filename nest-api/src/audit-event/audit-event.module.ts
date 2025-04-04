import { Module } from '@nestjs/common';
import { AuditEventService } from './audit-event.service';
import { AuditEventController } from './audit-event.controller';

@Module({
  controllers: [AuditEventController],
  providers: [AuditEventService],
  exports: [AuditEventService],
})
export class AuditEventModule {}
