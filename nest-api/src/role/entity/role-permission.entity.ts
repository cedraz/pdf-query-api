import { Module } from './module.entity';

export class RolePermission {
  id: number;
  allowed: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  module_id: number;
  role_id: number;

  module: Module;
}
