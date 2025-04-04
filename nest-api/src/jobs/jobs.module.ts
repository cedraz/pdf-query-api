import { Module } from '@nestjs/common';
import { SendEmailConsumerService } from './consumers/send-email-consumer.service';
import { SendEmailQueueService } from './queues/send-email-queue.service';
import { MailerService } from 'src/mailer/mailer.service';
import { BullModule } from '@nestjs/bullmq';
import { ClearVerificationRequestsQueueService } from './queues/clear-verification-requests-queue.service';
import { QueueNames } from './utils/queue-names.helper';
import { ClearVerificationRequestsConsumerService } from './consumers/clear-verification-codes-consumer.service';
import { AuditEventQueueService } from './queues/audit-event-queue.service';
import { AuditEventConsumerService } from './consumers/audit-event-consumer.service';
import { AuditEventService } from 'src/audit-event/audit-event.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: QueueNames.SEND_EMAIL_QUEUE,
      },
      {
        name: QueueNames.AUDIT_EVENT_QUEUE,
      },
      {
        name: QueueNames.CLEAR_VERIFICATION_REQUESTS_QUEUE,
      },
    ),
  ],
  providers: [
    SendEmailConsumerService,
    AuditEventConsumerService,
    ClearVerificationRequestsConsumerService,
    SendEmailQueueService,
    AuditEventQueueService,
    ClearVerificationRequestsQueueService,
    MailerService,
    AuditEventService,
  ],
  exports: [SendEmailQueueService, AuditEventQueueService],
})
export class JobsModule {}
