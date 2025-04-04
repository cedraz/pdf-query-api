import { ApiProperty } from '@nestjs/swagger';
import { VerificationType } from '@prisma/client';
import { IsString, IsEmail, IsEnum } from 'class-validator';

export class ValidateVerificationRequestDto {
  @IsEmail()
  identifier: string;

  @IsString()
  code: string;

  @IsEnum(VerificationType)
  @ApiProperty({ enum: VerificationType, enumName: 'VerificationType' })
  type: VerificationType;
}
