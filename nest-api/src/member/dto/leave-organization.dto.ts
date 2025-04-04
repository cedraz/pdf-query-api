import { IsString, IsUUID } from 'class-validator';

export class LeaveOrganizationDto {
  @IsString()
  @IsUUID()
  organization_id: string;

  @IsString()
  @IsUUID()
  user_id: string;
}
