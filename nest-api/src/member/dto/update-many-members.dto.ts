import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateManyMembersDto {
  @IsNotEmpty()
  @IsArray()
  @IsUUID('4', { each: true })
  member_ids: string[];
}
