import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  cpf?: string;

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
