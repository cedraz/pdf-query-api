import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsState } from 'src/common/decorators/is-state.decorator';

export class StateCommissionRateFormatDto {
  @IsString()
  @IsNotEmpty()
  @IsState()
  state_acronym: string;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_1: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_2: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_3: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_4: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_5: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_6: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_7: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_8: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_9: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_10: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  commission_rate_11: number;

  @IsNumber()
  @Transform(
    ({ value }: { value: string }) =>
      StateCommissionRateFormatDto.parseNumber(value),
    {
      toClassOnly: true,
    },
  )
  @IsNotEmpty()
  commission_rate_12: number;

  static parseNumber(value: string): number | null {
    if (typeof value === 'number') return value;
    if (value === null) return null;
    if (value === '') return null;

    const number = Number(value.trim().replace(',', '.'));

    return number;
  }
}
