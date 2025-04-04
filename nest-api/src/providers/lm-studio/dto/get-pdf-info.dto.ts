import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetPDFInfoDto {
  @IsString()
  @IsNotEmpty()
  doctags: string;

  @IsInt()
  credit: number;

  @IsInt()
  monthly_fee: number;
}
