import { ApiPropertyOptional } from '@nestjs/swagger';
import { PixKeyType } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateBankInformationDto {
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
}
