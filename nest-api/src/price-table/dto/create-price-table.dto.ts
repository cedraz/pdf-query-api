import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreatePriceTableDto {
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  organization_id: string;
}
