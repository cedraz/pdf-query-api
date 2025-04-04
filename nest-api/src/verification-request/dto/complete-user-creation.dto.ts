import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CompleteUserCreationDto {
  @IsEmail()
  identifier: string;

  @IsString()
  code: string;

  @IsUUID()
  organization_id: string;
}
