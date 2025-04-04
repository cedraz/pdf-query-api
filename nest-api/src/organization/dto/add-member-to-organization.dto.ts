import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddMemberToOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  member_id: string;

  @IsInt()
  role_id: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organization_id: string;
}
