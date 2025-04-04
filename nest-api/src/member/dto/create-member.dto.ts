import { IsDateString, IsInt, IsString, IsUUID } from 'class-validator';

export class CreateMemberDto {
  @IsInt()
  role_id: number;

  @IsString()
  @IsUUID()
  organization_id: string;

  @IsString()
  @IsUUID()
  user_id: string;

  @IsDateString()
  invited_at: string;
}
