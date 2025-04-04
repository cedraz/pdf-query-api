import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createEmailTemplate } from './utils/email-template';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: this.configService.get('MAIL_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASS'),
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async sendVerifyEmailCode({ to, subject, message }: SendEmailDto) {
    const emailTemplate = createEmailTemplate({ message });

    await this.transporter.sendMail({
      to: `<${to}>`,
      from: `noreply <${this.configService.get('MAIL_USER')}>`,
      subject,
      html: emailTemplate.html,
    });
  }
}
