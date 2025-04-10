import { RolePermission } from './role-permission.entity';

export class RoleSimple {
  id: number;
  name: string;
  description?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  organization_id: string;
}

export class Role extends RoleSimple {
  role_permissions?: RolePermission[];
}
