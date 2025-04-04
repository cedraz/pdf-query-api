import { IsString } from 'class-validator';

export class SetDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
