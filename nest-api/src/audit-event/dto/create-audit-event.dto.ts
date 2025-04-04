import { ApiPropertyOptional } from '@nestjs/swagger';
import { Operation } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { IsEnum, IsJSON, IsOptional, IsString } from 'class-validator';

export class CreateAuditEventDto {
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  old_data?: InputJsonValue;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  new_data?: InputJsonValue;

  @ApiPropertyOptional({
    enumName: 'Operation',
    enum: Operation,
  })
  @IsOptional()
  @IsEnum(Operation)
  operation?: Operation;

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  details?: InputJsonValue;
}
