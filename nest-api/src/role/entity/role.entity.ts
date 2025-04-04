import { RolePermission } from './role-permission.entity';

export class Role {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  organization_id: string;
  role_permissions?: RolePermission[];
}
