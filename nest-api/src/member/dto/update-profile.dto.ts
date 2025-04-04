import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  new_email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  birth_date?: Date;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  address_line?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  address_number?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  state?: string;
}
