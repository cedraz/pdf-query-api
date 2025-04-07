import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePriceTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  organization_id: string;
}
