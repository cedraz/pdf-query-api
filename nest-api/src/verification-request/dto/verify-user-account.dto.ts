import { IsString, IsEmail } from 'class-validator';

export class verifyUserAccountDto {
  @IsEmail()
  identifier: string;

  @IsString()
  code: string;
}
