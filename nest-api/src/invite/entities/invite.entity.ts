export class Invite {
  id: string;
  expires_at: Date;
  email: string;
  created_at: Date;
  updated_at: Date;
  inviter_id?: string | null;
  organization_id: string;
}
