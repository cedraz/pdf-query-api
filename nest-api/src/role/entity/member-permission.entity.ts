import { Module } from './module.entity';

export class MemberPermission {
  id: number;
  allowed: string[];

  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;

  member_id: string;
  module_id: number;
  module: Module;
}
