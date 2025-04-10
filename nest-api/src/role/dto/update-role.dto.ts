import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateRolePermissionDto } from './update-many-role-permissions.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateRoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: [UpdateRolePermissionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRolePermissionDto)
  role_permissions?: UpdateRolePermissionDto[];
}
