import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from 'src/mailer/mailer.service';
import { QueueNames } from '../utils/queue-names.helper';
import { SendEmailDto } from 'src/mailer/dto/send-email.dto';

@Processor(QueueNames.SEND_EMAIL_QUEUE)
export class SendEmailConsumerService extends WorkerHost {
  constructor(private mailerService: MailerService) {
    super();
  }

  async process({ data }: Job<SendEmailDto>) {
    const { to, message, subject } = data;

    await this.mailerService.sendVerifyEmailCode({ to, message, subject });
  }
}
