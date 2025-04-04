import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueNames } from '../utils/queue-names.helper';
import { CreateAuditEventDto } from 'src/audit-event/dto/create-audit-event.dto';

@Injectable()
export class AuditEventQueueService {
  constructor(
    @InjectQueue(QueueNames.AUDIT_EVENT_QUEUE)
    private auditEventQueue: Queue,
  ) {}

  async execute(createAuditEventDto: CreateAuditEventDto) {
    await this.auditEventQueue.add(QueueNames.AUDIT_EVENT_QUEUE, {
      ...createAuditEventDto,
    });
  }
}
