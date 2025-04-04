import { ApiPropertyOptional } from '@nestjs/swagger';
import { MemberStatus, PixKeyType } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UpdateMemberPermissionsDto } from './update-member-permissions.dto';
import { Type } from 'class-transformer';

export class UpdateMemberDto extends UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  new_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  last_active?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  role_id?: number;

  @ApiPropertyOptional({ enum: MemberStatus, enumName: 'MemberStatus' })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  supervisor_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank_corporate_reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agency_digit?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  account?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  account_digit?: string;

  @ApiPropertyOptional({ enum: PixKeyType, enumName: 'PixKeyType' })
  @IsOptional()
  @IsEnum(PixKeyType)
  pix_key_type?: PixKeyType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pix_key?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMemberPermissionsDto)
  member_permissions?: UpdateMemberPermissionsDto[];
}
