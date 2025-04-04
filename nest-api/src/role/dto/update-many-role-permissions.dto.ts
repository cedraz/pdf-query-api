import { IsArray, IsInt } from 'class-validator';

export class UpdateRolePermissionDto {
  @IsInt()
  role_id: number;

  @IsInt()
  module_id: number;

  @IsArray()
  allowed: string[];
}
