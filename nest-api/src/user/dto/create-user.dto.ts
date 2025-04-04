import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCPF } from 'src/common/decorators/is-cpf.decorator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsCPF()
  @Transform(({ value }: { value: string }) => value.replace(/[.-]/g, ''))
  @IsNotEmpty()
  @ApiProperty({
    example: '99192041027',
  })
  cpf: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  birth_date: Date;

  @IsString()
  @IsNotEmpty()
  password: string;

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
