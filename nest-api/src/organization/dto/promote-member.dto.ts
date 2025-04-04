import { IsInt, IsUUID } from 'class-validator';

export class ChangeMemberRoleDto {
  @IsUUID()
  member_id: string;

  @IsInt()
  role_id: number;
}
