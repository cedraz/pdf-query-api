import { ApiPropertyOptional } from '@nestjs/swagger';
import { ButtonColors } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCNPJ } from 'src/common/decorators/is-cnpj.decorator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsCNPJ()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @IsString()
  @IsNotEmpty()
  address_line: string;

  @IsString()
  @IsNotEmpty()
  address_number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  corporate_name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  billing_email: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  general_email: string;

  @ApiPropertyOptional({ enum: ButtonColors, enumName: 'ButtonColors' })
  @IsOptional()
  @IsEnum(ButtonColors)
  button_colors: ButtonColors;
}
