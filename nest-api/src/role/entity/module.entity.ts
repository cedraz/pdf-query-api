import { Action } from './action.entity';

export class ModuleSimple {
  id: number;
  name: string;
  display_name: string;
  description?: string | null;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export class Module extends ModuleSimple {
  actions: Action[];
}
