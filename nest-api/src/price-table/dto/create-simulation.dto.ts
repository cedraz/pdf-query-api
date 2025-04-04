import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSimulationDto {
  @IsInt()
  credit: number;

  @IsInt()
  monthly_fee: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
