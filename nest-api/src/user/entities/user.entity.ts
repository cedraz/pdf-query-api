import { ApiHideProperty } from '@nestjs/swagger';
import { UserSimple } from './user-simple.entity';
import { MemberSimple } from 'src/member/entities/member-simple.entity';

export class User extends UserSimple {
  @ApiHideProperty()
  password_hash?: string | null;

  member_on: MemberSimple[];
}
