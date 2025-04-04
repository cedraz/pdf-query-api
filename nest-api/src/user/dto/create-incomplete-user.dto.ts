import { IsInt, IsString, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateIncompleteUserDto extends CreateUserDto {
  @IsInt()
  role_id: number;

  @IsString()
  @IsUUID()
  organization_id: string;

  @IsString()
  @IsUUID()
  user_id: string;
}
