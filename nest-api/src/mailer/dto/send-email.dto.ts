import { IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  to: string;

  @IsString()
  message: string;

  @IsString()
  subject: string;
}
