import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueNames } from '../utils/queue-names.helper';
import { SendEmailDto } from 'src/mailer/dto/send-email.dto';

@Injectable()
export class SendEmailQueueService {
  constructor(
    @InjectQueue(QueueNames.SEND_EMAIL_QUEUE)
    private sendEmailQueue: Queue,
  ) {}

  async execute({ to, message, subject }: SendEmailDto) {
    await this.sendEmailQueue.add(QueueNames.SEND_EMAIL_QUEUE, {
      to,
      message,
      subject,
    });
  }
}
