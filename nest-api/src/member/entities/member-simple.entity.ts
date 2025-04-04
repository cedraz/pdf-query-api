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
