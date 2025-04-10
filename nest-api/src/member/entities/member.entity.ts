import { UserSimple } from 'src/user/entities/user-simple.entity';
import { Type } from 'class-transformer';
import { Role } from 'src/role/entity/role.entity';
import { MemberStatus } from '@prisma/client';

export class MemberSimple {
  id: string;
  invited_at: Date | null;
  joined_at?: Date | null;
  last_active?: Date | null;
  status: MemberStatus;
  created_at: Date;
  updated_at: Date;
  organization_id: string;
  user_id: string;
  role_id: number;
}

export class Member extends MemberSimple {
  @Type(() => UserSimple)
  user: UserSimple;

  @Type(() => Role)
  role: Role;
}
