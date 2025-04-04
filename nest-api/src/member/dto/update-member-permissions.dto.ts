import { IsArray, IsInt, IsUUID } from 'class-validator';

export class UpdateMemberPermissionsDto {
  @IsUUID()
  member_id: string;

  @IsInt()
  module_id: number;

  @IsArray()
  allowed: string[];
}
