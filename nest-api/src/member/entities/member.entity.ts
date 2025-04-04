import { UserSimple } from 'src/user/entities/user-simple.entity';
import { MemberSimple } from './member-simple.entity';
import { Type } from 'class-transformer';
import { Role } from 'src/role/entity/role.entity';

export class Member extends MemberSimple {
  @Type(() => UserSimple)
  user: UserSimple;

  @Type(() => Role)
  role: Role;
}
