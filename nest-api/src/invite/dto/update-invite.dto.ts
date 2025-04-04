import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateInviteDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  token?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  role_id?: number;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  expires_at?: Date;

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiPropertyOptional()
  organization_id?: string;
}
