import { Action } from './action.entity';
import { Module } from './module.entity';

export class RolePermissionSimple {
  id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  module_id: number;
  role_id: number;
}
export class RolePermission extends RolePermissionSimple {
  allowed: Action[];
  module: Module;
}
