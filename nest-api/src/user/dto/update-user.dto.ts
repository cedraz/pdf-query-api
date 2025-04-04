import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsDateString, IsOptional, IsString } from 'class-validator';
import { IsForbidden } from 'src/common/decorators/is-forbidden.decorator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  // @IsEmail()
  // @IsOptional()
  // @ApiPropertyOptional()
  // @IsForbidden()
  // @ApiHideProperty()
  // email?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  cpf?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional()
  birth_date?: Date;

  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  @IsForbidden()
  @ApiHideProperty()
  email_verified_at?: Date;

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
