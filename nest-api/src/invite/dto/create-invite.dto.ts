import { IsEmail, IsInt, IsUUID } from 'class-validator';

export class InviteRequestBodyDto {
  @IsEmail()
  email: string;

  @IsInt()
  role_id: number;
}

export class CreateInviteDto {
  @IsUUID()
  inviter_id: string;

  @IsEmail()
  email: string;

  @IsInt()
  role_id: number;

  @IsUUID()
  organization_id: string;
}
